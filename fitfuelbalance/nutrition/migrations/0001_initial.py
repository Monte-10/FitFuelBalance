# Generated by Django 4.2.6 on 2024-04-25 10:42

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AssignedOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='DailyDiet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='DayOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Diet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Dish',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='DishIngredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='Food',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100)),
                ('unit_weight', models.FloatField(default=0)),
                ('calories', models.FloatField(default=0)),
                ('protein', models.FloatField(default=0)),
                ('carbohydrates', models.FloatField(default=0)),
                ('sugar', models.FloatField(default=0)),
                ('fiber', models.FloatField(default=0)),
                ('fat', models.FloatField(default=0)),
                ('saturated_fat', models.FloatField(default=0)),
                ('gluten_free', models.BooleanField(default=False)),
                ('lactose_free', models.BooleanField(default=False)),
                ('vegan', models.BooleanField(default=False)),
                ('vegetarian', models.BooleanField(default=False)),
                ('pescetarian', models.BooleanField(default=False)),
                ('contains_meat', models.BooleanField(default=False)),
                ('contains_vegetables', models.BooleanField(default=False)),
                ('contains_fish_shellfish_canned_preserved', models.BooleanField(default=False)),
                ('cereal', models.BooleanField(default=False)),
                ('pasta_or_rice', models.BooleanField(default=False)),
                ('dairy_yogurt_cheese', models.BooleanField(default=False)),
                ('fruit', models.BooleanField(default=False)),
                ('nuts', models.BooleanField(default=False)),
                ('legume', models.BooleanField(default=False)),
                ('sauce_or_condiment', models.BooleanField(default=False)),
                ('deli_meat', models.BooleanField(default=False)),
                ('bread_or_toast', models.BooleanField(default=False)),
                ('egg', models.BooleanField(default=False)),
                ('special_drink_or_supplement', models.BooleanField(default=False)),
                ('tuber', models.BooleanField(default=False)),
                ('other', models.BooleanField(default=False)),
                ('image', models.ImageField(blank=True, null=True, upload_to='foods/images/')),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('quantity', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='MealDish',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('portion', models.DecimalField(decimal_places=2, max_digits=5)),
                ('notes', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='WeekOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('friday_option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friday_options', to='nutrition.dayoption')),
                ('monday_option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='monday_options', to='nutrition.dayoption')),
                ('saturday_option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saturday_options', to='nutrition.dayoption')),
                ('sunday_option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sunday_options', to='nutrition.dayoption')),
                ('thursday_option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thursday_options', to='nutrition.dayoption')),
            ],
        ),
    ]