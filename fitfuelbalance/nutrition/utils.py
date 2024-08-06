# utils.py
import pandas as pd
from django.db import transaction
from .models import Food

def import_foods_from_csv(csv_file):
    df = pd.read_csv(csv_file)
    
    # Usar una transacción asegura que todos los alimentos se importen correctamente
    # o que ningún cambio se aplique si ocurre un error.
    with transaction.atomic():
        for index, row in df.iterrows():
            Food.objects.create(
                name=row['name'],
                unit_weight=row.get('unit_weight', 0),
                calories=row['calories'],
                protein=row['protein'],
                carbohydrates=row['carbohydrates'],
                sugar=row['sugar'],
                fiber=row['fiber'],
                fat=row['fat'],
                saturated_fat=row['saturated_fat'],
                gluten_free=row['gluten_free'] in ['True', 'true', 1],
                lactose_free=row['lactose_free'] in ['True', 'true', 1],
                vegan=row['vegan'] in ['True', 'true', 1],
                vegetarian=row['vegetarian'] in ['True', 'true', 1],
                pescetarian=row['pescetarian'] in ['True', 'true', 1],
                contains_meat=row['contains_meat'] in ['True', 'true', 1],
                contains_vegetables=row['contains_vegetables'] in ['True', 'true', 1],
                contains_fish_shellfish_canned_preserved=row['contains_fish_shellfish_canned_preserved'] in ['True', 'true', 1],
                cereal=row['cereal'] in ['True', 'true', 1],
                pasta_or_rice=row['pasta_or_rice'] in ['True', 'true', 1],
                dairy_yogurt_cheese=row['dairy_yogurt_cheese'] in ['True', 'true', 1],
                fruit=row['fruit'] in ['True', 'true', 1],
                nuts=row['nuts'] in ['True', 'true', 1],
                legume=row['legume'] in ['True', 'true', 1],
                sauce_or_condiment=row['sauce_or_condiment'] in ['True', 'true', 1],
                deli_meat=row['deli_meat'] in ['True', 'true', 1],
                bread_or_toast=row['bread_or_toast'] in ['True', 'true', 1],
                egg=row['egg'] in ['True', 'true', 1],
                special_drink_or_supplement=row['special_drink_or_supplement'] in ['True', 'true', 1],
                tuber=row['tuber'] in ['True', 'true', 1],
                other=row['other'] in ['True', 'true', 1],
            )
