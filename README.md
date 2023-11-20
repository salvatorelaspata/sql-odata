# oData Integration

## Overview

oData is a RESTful API standard protocol for querying and updating data. It is a standard that is used by many enterprise applications and is supported by many platforms.

This integration provides a RESTful API that is compatible with the oData standard. It is a wrapper around the Platformatic DB API.

## Docs

- [oData](https://www.odata.org/)
- [Terminology](https://www.odata.org/documentation/odata-version-2-0/terminology/)
- [RFC oData V1](https://docs.oasis-open.org/odata/odata-openapi/v1.0/odata-openapi-v1.0.html)
- [RFC oData V4](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html)

## Crud Operations

In oData Service the crud operations are mapped to the following HTTP methods:

| HTTP Method | oData Operation | Description                                                                                         |
| ----------- | --------------- | --------------------------------------------------------------------------------------------------- |
| GET         | Query           | Retrieves the collection of resources consistent with the query options present in the URL (array). |
| GET         | Read            | Retrieves a single resource from the keys provided (object).                                        |
| POST        | Create          | Creates a new resource.                                                                             |
| PUT         | Update          | Updates an existing resource.                                                                       |
| DELETE      | Delete          | Deletes an existing resource from the keys provided.                                                |

## Query Options (GET)

oData query options are provided as query parameters in the URL.

| Query Option | Description                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------- |
| $filter      | Filters the collection of resources based on a Boolean condition.                                   |
| $select      | Selects a subset of properties from each resource.                                                  |
| $expand      | Expands related entities inline.                                                                    |
| $orderby     | Sorts the collection of resources in ascending or descending order based on one or more properties. |
| $top         | Returns only the first n resources in the collection.                                               |
| $skip        | Skips the first n resources in the collection.                                                      |
| $count       | Returns the total count of resources in the collection.                                             |

> !!! the query options are permitter in the GET method only.

## Enpoints

| Crud Operation | HTTP Method | Endpoint               | Description                                                                                         |
| -------------- | ----------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Query          | GET         | /odata/{entity}        | Retrieves the collection of resources consistent with the query options present in the URL (array). |
| Read           | GET         | /odata/{entity}({key}) | Retrieves a single resource the keys provided (object).                                             |
| Create         | POST        | /odata/{entity}        | Creates a new resource.                                                                             |
| Update         | PUT         | /odata/{entity}({key}) | Updates an existing resource.                                                                       |
| Delete         | DELETE      | /odata/{entity}({key}) | Deletes an existing resource.                                                                       |

> !!! {entity} rappresent the name of the entity, {key} rappresent the key of the entity.
> In case of multiple keys, the keys are separated by comma (eg. {entity}(Id='3',Name='salvatore') ).


## Examples

### $metadata

GET: `{{host}}/v2/$metadata`

### GET - query: 

`{{host}}/v2/Movies`

`{{host}}/v2/Movies?$filter=title eq 'asd'&$select=title`

$expand: `{{host}}/v2/Movies?$expand=Quotes` Coming soon...

### GET - read: 

`{{host}}/v2/Movies('0')`

Association: `{{host}}/v2/Movies('0')/Quotes`

### POST - create: 

`{{host}}/v2/Movies`

Coming soon...

### PUT - update: 

`{{host}}/v2/Movies('0')`

Coming soon...

### DELETE - delete: 

`{{host}}/v2/Movies('0')`

Coming soon...

# Platformatic DB API

This is a generated [Platformatic DB](https://docs.platformatic.dev/docs/reference/db/introduction) application.

## Requirements

Platformatic supports macOS, Linux and Windows ([WSL](https://docs.microsoft.com/windows/wsl/) recommended).
You'll need to have [Node.js](https://nodejs.org/) >= v18.8.0 or >= v20.6.0

## Setup

1. Install dependencies:

```bash
npm install
```

2. Apply migrations:

```bash
npm run migrate
```


## Usage

Run the API with:

```bash
npm start
```

### Explore
- ⚡ The Platformatic DB server is running at http://localhost:3042/
- 📔 View the REST API's Swagger documentation at http://localhost:3042/documentation/
- 🔍 Try out the GraphiQL web UI at http://localhost:3042/graphiql
- ****!!! The oData API is available at http://localhost:3042/odata****

