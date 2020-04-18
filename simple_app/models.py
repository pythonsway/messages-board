from django.db import models
from django.contrib.auth.models import User

from auth0authorization.models import ExtendedUser


class Message(models.Model):
    # user = models.ForeignKey('auth.User')
    user = models.ForeignKey(ExtendedUser, blank=True, null=True, on_delete=models.SET_NULL)
    message = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message


class Like(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    message = models.ForeignKey(Message, related_name='likes', on_delete=models.CASCADE)

