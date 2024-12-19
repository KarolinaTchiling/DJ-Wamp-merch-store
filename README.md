# 4413 project
View the project on GitHub at https://github.com/JUB-Yoush/4413-project.git

## Setup

Before any method: Clone the repo.

```
git clone git@github.com/JUB-Yoush/4413-project.git
```

### Quickstart (running within the container)

4413 Project is Containerized with **Docker**, so running it is easy:

1. Install:

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/).

2. Clone the repo.

```
git clone git@github.com/JUB-Yoush/4413-project.git
```

3. cd into the project root and run the docker compose file.

```
docker-compose up --build --no-cache
```

#### Ports

- Frontend runs on port `3000`
- Backend runs on port `8000`

## Running on your machine:

### Frontend

1. Install

- [bun](https://bun.sh/)

2. Then install dependencies

```
cd project-4413-project/frontend

bun install
```

3. Run Frontend

```
bun run dev
```

### Backend:

2. Install

- [python3.12](https://www.python.org/downloads/release/python-3120/)
- [venv](https://realpython.com/python-virtual-environments-a-primer/)

3. create a python virtual environment named "venv", and install packages based on `requirements.txt`

```
python3.12 -m venv "venv"
source venv/bin/activate
pip install -r requirements.txt
```

4. Run flask server.

```
flask run
```

## Admin Access

For admin access, admin accounts can be created on the application from the Admin Sign Up page which is reachable from the Log In page > To Admin View > Sign Up. Alternatively, visit http://localhost:3000/admin/signup

## Frontend:

This project uses:

- **Bun**: Javascript runtime environment
- **React**: UI
- **TypeScript**: Javascript with static typing
- **TailwindCSS**: CSS preprocessor
- **Vite**: Javascript package bundler
- **Eslint & Prettier**: Javascript linter

## Backend:

This project uses:

- **Python**: Programming Language
- **Flask**: Web Server framework for python
- **Ruff**: Python Linter

## Contributing

Submit a pull request to contribute your ticket changes back into main, await approval from one other developer before merging.

Ensure the following linters are ran before pushing work:

```
pip freeze > requirements.txt
bun lint
bun format
ruff check
ruff format
```
