# Generated by Django 4.2.6 on 2024-08-06 16:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_regularusermeasurement'),
        ('nutrition', '0003_assignedoption_pdf_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomMeal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meal_number', models.PositiveIntegerField()),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='ingredient',
            name='unit_based',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.regularuser')),
            ],
        ),
        migrations.CreateModel(
            name='CustomMealIngredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField(default=0)),
                ('unit_based', models.BooleanField(default=False)),
                ('custom_meal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nutrition.custommeal')),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nutrition.ingredient')),
            ],
        ),
        migrations.AddField(
            model_name='custommeal',
            name='plan',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nutrition.plan'),
        ),
    ]
