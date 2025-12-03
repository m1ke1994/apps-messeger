from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0003_user_profile_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="education",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="skills",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="user",
            name="status",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
