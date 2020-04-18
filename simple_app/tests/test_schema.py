import pytest
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory
from mixer.backend.django import mixer
from graphql_relay.node.node import to_global_id

from .. import schema


pytestmark = pytest.mark.django_db


def test_message_type():
    instance = schema.MessageType()
    assert instance


def test_resolve_all_messages():
    mixer.blend('simple_app.Message')
    mixer.blend('simple_app.Message')
    q = schema.Query()
    res = q.resolve_all_messages(None)
    assert res.count() == 2, 'Should return all messages'


def test_resolve_message():
    msg = mixer.blend('simple_app.Message')
    q = schema.Query()
    id = to_global_id('MessageType', msg.pk)
    res = q.resolve_message(None, id=id)
    assert res == msg, 'Should return the requested message'


def test_create_message_mutation():
    user = mixer.blend('auth.User')
    mut = schema.CreateMessage()

    data = {'message': 'Test'}
    req = RequestFactory().get('/')
    req.user = AnonymousUser()
    info = {'context': req}
    # res = mut.mutate(None, data, req, None)
    res = mut.mutate(None, info, data)
    assert res.status == 403, 'Should return 403 if user is not logged in'

    req.user = user
    res = mut.mutate(None, info, {})
    assert res.status == 400, 'Should return 400 if there are form errors'
    assert 'message' in res.formErrors, (
        'Should have form error for message field')

    res = mut.mutate(None, info, data)
    assert res.status == 200, 'Should return 200 if mutation is successful'
    assert res.message.pk == 1, 'Should create new message'


# def resolve_my_field(self, args, context, info):
# def resolve_my_field(self, info, my_arg):
#                     (root, info, **args)