# Generated by Django 2.2.3 on 2019-11-20 23:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_auto_20191120_1346'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savedforlateritem',
            name='image',
            field=models.TextField(blank=True, default=''),
        ),
    ]
