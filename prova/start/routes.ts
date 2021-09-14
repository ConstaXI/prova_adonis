/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/users', 'UsersController.create').middleware('isAdmin')

Route.post('/login', 'AuthController.login')

Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.delete('/users/:id', 'UsersController.delete')
  Route.put('/users/:id', 'UsersController.update')
}).middleware('auth')

Route.group(() => {
  Route.post('/games', 'GamesController.create')
  Route.get('/games', 'GamesController.index')
  Route.delete('/games/:id', 'GamesController.delete')
  Route.put('/games', 'GamesController.update')
}).middleware(['auth', 'isAdmin'])

Route.group(() => {
  Route.post('/passwords', 'ForgotPasswordsController.store')
  Route.put('/passwords/:token', 'ForgotPasswordsController.update')
})

Route.group(() => {
  Route.post('/bets', 'BetsController.create')
  Route.get('/bets', 'BetsController.index')
}).middleware('auth')
