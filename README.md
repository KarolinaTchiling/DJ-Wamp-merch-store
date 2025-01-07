# DJ Wamp's Merch Store

This project was developed as part of the "Building E-Commerce Systems" course. DJ WAMP's Merch Store is a full-stack e-commerce platform built using Flask for the backend and React with TypeScript for the frontend. The store showcases merchandise, features a dynamic catalog filtering system, and integrates MongoDB Atlas for database management. Designed to highlight key concepts in e-commerce systems, the project demonstrates skills in frontend-backend integration, API development, and user-centric design.

#### Features
- Intuitive catalog view with search and filtering
- Visitors can browse, add/edit cart and create an account 
- Users can login, browse, checkout, edit account information and edit their cart
- Admins can add, edit, and delete products and edits users/sales

# 🎉 [Live Demo](https://dj-wamp-merch-store.vercel.app) 🎉


## Tech-Stack
### Frontend
- **Bun**: Javascript runtime environment
- **React**: UI
- **TypeScript**: Javascript with static typing
- **TailwindCSS**: CSS preprocessor
- **Vite**: Javascript package bundler
- **Eslint & Prettier**: Javascript linter

### Backend
- **Python**: Programming Language
- **Flask**: Web Server framework for python
- **Ruff**: Python Linter

### Database
- **MongoDB**: BSON database.
- **MongoDBAtlas**: Cloud hosted MongoDB servers
- **AWS S3**: Cloud hosted database optimized for images.

### Deployment
- **Render**: Hosts the backend
- **Vercel**: Hosts the frontend


## To Run on Local Machine:

#### NOTE
If installing on your machine you will not have access to the database or codebase secrets. The following is only an example of how this e-store can be ran locally.

```
git clone https://github.com/KarolinaTchiling/DJ-Wamp-merch-store
```

#### Frontend

1. Install [bun](https://bun.sh/)

2. Install dependencies

```
cd DJ-Wamp-merch-store/frontend

bun install
```

3. Run Frontend

```
bun run dev
```

#### Backend:

1. Install

    - [python3.12](https://www.python.org/downloads/release/python-3120/)
    - [venv](https://realpython.com/python-virtual-environments-a-primer/)


2. create a python virtual environment named "venv", and install packages based on `requirements.txt`

```
cd DJ-Wamp-merch-store/backend
python3.12 -m venv "venv"
source venv/bin/activate
pip install -r requirements.txt
```

3. Run flask server
```
flask run
```



