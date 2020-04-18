import json

import graphene
import django_filters
from django.db.models import Count, Sum
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphql_relay import from_global_id
from graphql import GraphQLError

from . import models
from auth0authorization.models import ExtendedUser


# List that provides ways of slicing and paginating through
# class MessageConnection(graphene.relay.Connection):
#     class Meta:
#         node = MessageNode

# "DjangoConnectionField only accepts DjangoObjectType types"
#


class ExtendedConnection(graphene.relay.Connection):
    class Meta:
        abstract = True

    total_count = graphene.Int()
    edge_count = graphene.Int()

    def resolve_total_count(root, info, **kwargs):
        return root.length

    def resolve_edge_count(root, info, **kwargs):
        return len(root.edges)


class MessageFilter(django_filters.FilterSet):
    class Meta:
        model = models.Message
        fields = {
            'message': ['icontains'],
            'likes': ['exact'],
            'user__nick': ['exact'],
        }

    # message = django_filters.CharFilter(lookup_expr=['icontains'])
    order_by = django_filters.OrderingFilter(
        fields=(
            ('creation_date', 'creation_date'),
        )
    )


class ExtendedUserNode(DjangoObjectType):
    class Meta:
        model = ExtendedUser


class MessageNode(DjangoObjectType):
    class Meta:
        model = models.Message
        # filter_fields = {'message': ['icontains']}
        filterset_class = MessageFilter
        interfaces = (graphene.relay.Node,)
        connection_class = ExtendedConnection

    user_liked = graphene.Boolean()

    def resolve_user_liked(root, info, **kwargs):
        user = info.context.user
        # 'root': <class 'simple_app.models.Message'>
        return models.Like.objects.filter(
            user=user, message=root).exists()


class LikeNode(DjangoObjectType):
    class Meta:
        model = models.Like
        filter_fields = {
            # 'user__username': ['exact'],
            'message__message': ['exact', 'icontains', 'istartswith'],
        }
        interfaces = (graphene.relay.Node,)
        connection_class = ExtendedConnection


class Query(graphene.ObjectType):
    all_messages = DjangoFilterConnectionField(MessageNode)
    message = graphene.relay.Node.Field(MessageNode)

    all_likes = DjangoFilterConnectionField(LikeNode)
    like = graphene.relay.Node.Field(LikeNode)

    # def resolve_all_messages(root, info, **kwargs):
    #     return models.Message.objects.all()

    # def resolve_message(root, info, id):
    #     rid = from_global_id(id)
    #     # rid is a tuple: ('MessageType', '1')
    #     return models.Message.objects.get(pk=rid[1])


class CreateMessageMutation(graphene.relay.ClientIDMutation):
    class Input:
        message = graphene.String()
        nick = graphene.String()

    message = graphene.Field(MessageNode)
    # maybe get rid of those (instead raise error?)
    status = graphene.Int()
    formErrors = graphene.String()

    def mutate_and_get_payload(root, info, **input):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('You must be logged in to add message')
        # Here we would usually use Django forms to validate the input
        message = input.get('message')
        nick = input.get('nick')
        if not message:
            return CreateMessageMutation(
                status=400,
                formErrors=json.dumps(
                    {'message': ['Please enter a message.']}))
        try:
            ext_user_obj = ExtendedUser.objects.get(user=user)
        except ExtendedUser.DoesNotExist:
            ext_user_obj = ExtendedUser.objects.create(
                user=user, nick=nick)
        msg_obj = models.Message.objects.create(
            user=ext_user_obj, message=message)
        return CreateMessageMutation(status=200, message=msg_obj)


class CreateLikeMutation(graphene.relay.ClientIDMutation):
    class Input:
        message_id = graphene.String()

    message = graphene.Field(MessageNode)
    likes_number = graphene.Int()

    def mutate_and_get_payload(root, info, **input):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('You must be logged in to like')
        rid = from_global_id(input.get('message_id'))
        # rid is a tuple: ('MessageType', '1')
        msg_obj = models.Message.objects.get(pk=rid[1])
        models.Like.objects.create(
            user=user, message=msg_obj)
        counted_likes = msg_obj.likes.count()
        return CreateLikeMutation(likes_number=counted_likes, message=msg_obj)


class Mutation(object):
    create_message = CreateMessageMutation.Field()
    create_like = CreateLikeMutation.Field()
