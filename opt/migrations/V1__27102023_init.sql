create table boardgame
(
    boardgame_name varchar(255) primary key,
    players        int not null
);

create table owner
(
    username varchar(255) primary key
);

create table collection_line
(
    boardgame_name varchar(255) not null,
    owner_username varchar(255) not null,
    primary key (boardgame_name, owner_username)
);