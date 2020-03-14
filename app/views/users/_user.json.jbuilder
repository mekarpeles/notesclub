json.(user, :id, :email, :username, :name)
json.token user.generate_jwt
