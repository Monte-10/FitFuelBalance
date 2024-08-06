from django.core.management.base import BaseCommand
from nutrition.models import Food
import pandas as pd
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fitfuelbalance.settings')  # Replace 'fitfuelbalance.settings' with your actual settings module
django.setup()

class Command(BaseCommand):
    help = 'Load a list of foods from a CSV file into the Food model'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file to import.')

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']
        df = pd.read_csv(csv_file_path)
        
        for index, row in df.iterrows():
            food = Food(
                name=row['name'],
                calories=row['calories'],
                protein=row['protein'],
                carbohydrates=row['carbohydrates'],
                sugar=row['sugar'],
                fiber=row['fiber'],
                fat=row['fat'],
                saturated_fat=row['saturated_fat'],
                gluten_free=row['gluten_free'],
                lactose_free=row['lactose_free'],
                vegan=row['vegan'],
                vegetarian=row['vegetarian'],
                pescetarian=row['pescetarian'],
                contains_meat=row['contains_meat'],
                contains_vegetables=row['contains_vegetables'],
                contains_fish_shellfish=row['contains_fish_shellfish'],
                canned_or_preserved=row['canned_or_preserved'],
                cereal=row['cereal'],
                pasta_or_rice=row['pasta_or_rice'],
                dairy_yogurt_cheese=row['dairy_yogurt_cheese'],
                fruit=row['fruit'],
                nuts=row['nuts'],
                legume=row['legume'],
                sauce_or_condiment=row['sauce_or_condiment'],
                deli_meat=row['deli_meat'],
                bread_or_toast=row['bread_or_toast'],
                egg=row['egg'],
                special_drink_or_supplement=row['special_drink_or_supplement'],
                tuber=row['tuber'],
                # Add other fields if necessary
            )
            food.save()
            self.stdout.write(self.style.SUCCESS(f'Food "{food.name}" created successfully.'))

        self.stdout.write(self.style.SUCCESS('All foods have been imported.'))
