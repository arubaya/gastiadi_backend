'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Drive = use('Drive');
const Helpers = use('Helpers')

const User = use("App/Models/User");

const Chance = use('chance')
const { validate } = use("Validator");

class UserController {
  /**
   * Function for create random unique id.
   */
  async idGenerator () {
    let notUnique = true;
    const chance = new Chance();
    do {
      const id = chance.string({ length: 20, alpha: true, numeric: true })
      const data = await User.findBy('id', id)
      if (data) {
        notUnique = true;
      } else {
        notUnique = false;
        return id;
      }
    } while(notUnique);
  }
  /**
   * Show a list of all users.
   * DEVELOPMENT ONLY
   */
  async devIndex ({ request, response }) {
    const req = request.all();
    // const resData = await User.all();
    // return response.status(200).json(resData);

    // const id = await this.idGenerator();
    // console.log(`output: ${id}`);
    // return response.status(200).json({
    //   id
    // })

    // const filePath = `news/images/test.jpg`;
    // const isExist = await Drive.exists(filePath);

    // if (isExist) {
    //   return response.download(Helpers.publicPath(filePath));
    // } else {
    //   return response.status(200).json({
    //       message: "File not exist"
    //     })
    // }

    const result = await User.findBy('name', req.cs_name)
    console.log(result.id);
  }
  /**
   * Get a single user id by name.
   */
   async getUser ({ request, response}) {
    const req = request.all();

    const result = await User.findBy("name", req.user_name);
    return response.status(200).json({
      user_id: result.id
    });

 }






  /**
   * Show a list of all general users.
   */
  async index ({ request, response }) {
    const result = await User.query().select('id', 'name').where('role_id', 3).fetch();
    return response.status(200).json(result);
  }

  /**
   * Get user detail by id.
   */
  async userDetail ({ params, response, auth }) {
    const id = params.id;
    const result = await User.findBy('id', id);
    return response.status(200).json(result);
    // try {
    //   await auth.check()
    //   const result = await User.findBy('id', id);
    //   return response.status(200).json(result);
    // } catch (error) {
    //   response.json({message: 'Missing or invalid api token'})
    // }
  }


  /*
   | Register a new user, cs, admin.
   | POST users
   |
   */
  /**
   * Register a new user account.
   * POST method
   */
  async registerNewUser ({ request, response, auth }) {
    const req = request.all();
    const rules = {
      name: "required",
      email: "required|email|unique:users,email",
      password: "required|min:6|max:30",
    };

    const validation = await validate(req, rules);

    if (validation.fails()) {
      return response.status(400).json({
        message: validation.messages(),
      });
    }

    const result = await User.findBy("email", req.email);

    if (result) {
      const resData = {
        code: 200,
        message: "Email already exist. Please create another Account",
        data: result,
      };
      return response.status(200).json(resData);
    } else {
      const id = await this.idGenerator();
      const user = new User();
      user.id = id;
      user.name = req.name;
      user.email = req.email;
      user.password = req.password;
      user.role_id = 3;
      await user.save();
      const userData = await User.findBy('id', id);

      const token = await auth.generate(userData)
      const resData = {
        code: 201,
        message: "Account has been created successfully",
        data: userData,
        token
      };

      return response.status(201).json(resData);
    }
  }

  /**
   * Register a new customer service account.
   * POST method
   */
   async registerNewCS ({ request, response }) {
    const req = request.all();
    const rules = {
      name: "required",
      email: "required|email|unique:users,email",
      password: "required|min:6|max:30",
      cs_region_id: "required|integer",
    };

    const validation = await validate(req, rules);

    if (validation.fails()) {
      return response.status(400).json({
        message: validation.messages(),
      });
    }

    const result = await User.findBy("name", req.name);

    if (result) {
      const resData = {
        code: 200,
        message: "Email already exist. Please create another Account",
        data: result,
      };
      return response.status(200).json(resData);
    } else {
      const id = await this.idGenerator();
      const user = new User();
      user.id = id;
      user.name = req.name;
      user.email = req.email;
      user.password = req.password;
      user.role_id = 2;
      user.cs_region_id = req.cs_region_id;
      await user.save();
      const userData = await User.findBy('id', id);
      const resData = {
        code: 201,
        message: "Customer service account has been created successfully",
        data: userData,
      };

      return response.status(201).json(resData);
    }
  }

  /**
   * Register a new admin account.
   * POST method
   */
   async registerNewAdmin ({ request, response }) {
    const req = request.all();
    const rules = {
      name: "required",
      email: "required|email|unique:users,email",
      password: "required|min:6|max:30",
    };

    const validation = await validate(req, rules);

    if (validation.fails()) {
      return response.status(400).json({
        message: validation.messages(),
      });
    }

    const result = await User.findBy("name", req.name);

    if (result) {
      const resData = {
        code: 200,
        message: "Email already exist. Please create another Account",
        data: result,
      };
      return response.status(200).json(resData);
    } else {
      const id = await this.idGenerator();
      const user = new User();
      user.id = id;
      user.name = req.name;
      user.email = req.email;
      user.password = req.password;
      user.role_id = 1;
      await user.save();
      const userData = await User.findBy('id', id);
      const resData = {
        code: 201,
        message: "Admin account has been created successfully",
        data: userData,
      };

      return response.status(201).json(resData);
    }
  }

  




  /**
   * Login handler.
   */
  async login ({ request, response, auth }) {
    const req = request.all();

    const token = await auth
    .withRefreshToken()
    .attempt(req.email, req.password)
    if (token) {
      const data = await User
      .query()
      .select('id', 'name', 'role_id')
      .where('email', req.email)
      .fetch();

      return response.status(200).json({
        data,
        token
      });
    }
  }

  /**
   * Logout handler.
   */
   async logout ({ response, auth, request }) {
    const apiToken = auth.getAuthHeader()
    const authReturn = await auth
      .authenticator('jwt')
      .revokeTokens([apiToken])
    // const token = await auth.listTokens()
    return response.status(200).json({authReturn});
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
