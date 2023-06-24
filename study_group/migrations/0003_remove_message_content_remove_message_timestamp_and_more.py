# Generated by Django 4.1.7 on 2023-06-24 09:32

import datetime
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('study_group', '0002_message_room_remove_thread_users_delete_chatmessage_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='content',
        ),
        migrations.RemoveField(
            model_name='message',
            name='timestamp',
        ),
        migrations.AddField(
            model_name='message',
            name='date',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='message',
            name='value',
            field=models.CharField(default=django.utils.timezone.now, max_length=1000000),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='message',
            name='room',
            field=models.CharField(max_length=1000000),
        ),
        migrations.AlterField(
            model_name='room',
            name='name',
            field=models.CharField(max_length=1000),
        ),
    ]
