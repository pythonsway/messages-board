from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from . import models

# Define an inline admin descriptor for ExtendedUser model
class ExtendedUserInline(admin.StackedInline):
    model = models.ExtendedUser

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (ExtendedUserInline,)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
