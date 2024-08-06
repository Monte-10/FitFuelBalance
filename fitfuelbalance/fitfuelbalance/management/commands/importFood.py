# Command file
from django.core.management.base import BaseCommand
from nutrition.utils import import_foods_from_csv

class Command(BaseCommand):
    help = 'Load a list of foods from a CSV file into the Food model'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file to import.')

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']
        import_foods_from_csv(csv_file_path)
        self.stdout.write(self.style.SUCCESS('All foods have been imported.'))
