NAME				:= celchannel
SERVICES			:= nginx postgresql
PATH_COMPOSE		:= ./services/docker-compose.yml
VOLUME_PATH_MAIN	:= ~/$(NAME)
VOLUMES_PATH		:= $(VOLUME_PATH_MAIN)/db/

all: $(NAME)

$(NAME): build up

up:
	docker compose -f $(PATH_COMPOSE) up --detach

build:
	mkdir -p $(VOLUME_PATH_MAIN) $(VOLUMES_PATH)
	docker compose -f $(PATH_COMPOSE) build

stop:
	docker compose -f $(PATH_COMPOSE) stop

clean:
	docker compose -f $(PATH_COMPOSE) down || echo "docker compose down failed"
	docker volume rm -f $$(docker volume ls -q) || echo "docker volume rm failed"
	docker rmi -f $$(docker image ls -q) || echo "docker rmi failed"
	sudo rm -rf $(VOLUME_PATH_MAIN)

re:	clean $(NAME)
