import graphene
import graphql_jwt

import simple_app.schema
# import user_profile.schema


class Queries(simple_app.schema.Query, graphene.ObjectType):
    # dummy = graphene.String()
    pass


class Mutations(simple_app.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Queries, mutation=Mutations)
