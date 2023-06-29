db = db.getSiblingDB("seminario");
db.createUser({
  user: "miusuario",
  pwd: "mipassword",
  roles: [{ role: "readWrite", db: "seminario" }],
});
