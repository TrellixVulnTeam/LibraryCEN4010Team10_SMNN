# Generated by Django 2.2.3 on 2019-11-21 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20191120_1815'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savedforlateritem',
            name='genre',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='savedforlateritem',
            name='label',
            field=models.TextField(blank=True, default=''),
        ),
    ]
