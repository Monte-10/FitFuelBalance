# Makefile

# Variables
MANAGE_PY=python3 manage.py

.PHONY: migrations migrate

# Crea migraciones para todas las aplicaciones
migrations:
	$(MANAGE_PY) makemigrations sport user nutrition

# Aplica todas las migraciones
migrate:
	$(MANAGE_PY) migrate

run:
	$(MANAGE_PY) runserver

# Comando para realizar ambas tareas: crear y aplicar migraciones
all: migrations migrate

all-run: all run