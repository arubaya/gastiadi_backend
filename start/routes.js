'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  /*
  | Route group for development only.
  | Don't forget to delete or comment this group while in production. 
  */
  Route.post('testuser', 'UserController.devIndex');
  Route.get('rooms', 'ChatRoomController.devIndex');
  Route.post('user', 'UserController.getUser')

  /**
   * Route for mobile phone API general user
   */
  Route.post('adduser', 'UserController.registerNewUser');

  /**
   * Route for web API customer service
   */
  Route.post('addcs', 'UserController.registerNewCS');

  /**
   * Route for web API admin user
   */
  Route.post('addadmin', 'UserController.registerNewAdmin');

  /**
   * Route for login user
   */
   Route.post('login', 'UserController.login');

  /**
   * Route for login user
   */
  Route.post('logout', 'UserController.logout');



}).prefix('api/v1')


// Route Group with auth
Route.group(() => {

  /*
  | Route group for User controller.
  */
  /**
   * Route for get all general users list
   */
  Route.get('userslist', 'UserController.index');

  /**
   * Route for get single user detail by id
   */
  Route.get('user/:id', 'UserController.userDetail');

  /*
  | Route group for Chat room controller.
  */
  /**
   * Route for create new room
   */
  Route.post('addroom', 'ChatRoomController.storeNewRoom');

  /**
   * Route for join room
   */
  Route.post('joinroom', 'ChatRoomController.joinRoom');

  /**
   * Route for get all rooms. Return id and user_name
   */
  Route.get('chatrooms', 'ChatRoomController.getAllRooms');

  /**
   * Route for get a room detail by id
   */
  Route.get('chatrooms/:id', 'ChatRoomController.getRoomDetails');

  /*
  | Route group for Message controller.
  */
  /**
   * Route for create new room
   */
   Route.get('messages/room/:id', 'MessageController.getMessagesByRoomId');

}).prefix('api/v1')//.middleware('auth')
