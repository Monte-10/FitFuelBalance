set -o errexit  # exit on error

pip install -r requirements.txt

python3 manage.py makemigrations sport user nutrition

python3 manage.py migrate