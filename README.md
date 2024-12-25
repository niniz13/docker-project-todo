# TP Docker Jérémy Gross : TODO APP

## Présentation du projet

Pour ce projet, j'ai développer un app pour gérer ses TODOS. Sur la page d'accueil, on peut voir la liste des TODOS. Pour chaque TODO, on peut :

- Le modifier en cliquant sur l'icone Crayon
- Le supprimer en cliquant sur l'icone Poubelle

Et enfin on peut créer un TODO en cliquant sur le bouton ADD.

## Structure du projet

Pour cet application, j'ai créer trois conteneurs :

- Un conteneur Postgres pour la base de données
- Un conteneur Python-Alpine pour le backend Django (Alpine qui est une distribution Linux très légère, utile donc pour cette application très petite)
- Un conteneur Node-Alpine pour le frontend Vite-React.
- Un conteneur Uptime-Kuma pour monitorer ces conteneurs

## Points techniques

- Un healthcheck pour le conteneur base de données
- Deux clusters : un contenant la base de données et le backend, et l'autre avec le backend et le frontend. L'utilisateur n'a pas accès à la base de données
- Création d'un utilsateur dans le conteneur backend
- Utilisation d'un entrypoint, généralement utilisé pour les applications web. Ici, il permet de laisser du temps au conteneur base de données de se lancer, et de faire les migrations, et il permet de lancer le serveur soit avec runserver, qui en Django, est utile en mode développement, soit avec gunicorn, qui est un serveur WSGI, et qui est plus performant dans un environnement de production.
