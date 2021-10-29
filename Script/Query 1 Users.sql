SELECT * FROM `tienda-grupo-23`.users;
CREATE table users(
id bigint primary key auto_increment not null,
name varchar (100) not null,
email varchar (50) not null,
role varchar (50) not null);

INSERT INTO users (name, email, role) VALUES ("Oscar Cifuentes", "ocifuentes@hotmail.com","Invitado");



INSERT INTO users (name, email, role) VALUES ("Pablo Rodriguez", "prodriguez@hotmail.com","Invitado");

INSERT INTO users (name, email, role) VALUES ("carlos Ospina", "cospina@hotmail.com","Vendedor");
UPDATE users SET role = "Vendedor" WHERE email = "ocifuentes@hotmail.com";