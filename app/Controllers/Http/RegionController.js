'use strict'
const Region = use("App/Models/Region");

class RegionController {
  /**
   * Get all list region.
   * Get /regions
   */
   async index ({ response }) {
    const result = await Region
    .query()
    .select('id', 'name')
    .fetch();

    return response.status(200).json({result})
  }

  /**
   * Get region id by name.
   * POST /region
   */
   async getRegionByName ({ request, response }) {
    const req = request.all()
    const result = await Region
    .query()
    .select('id')
    .where('name', req.name)
    .fetch();

    return response.status(200).json({result})
  }
}

module.exports = RegionController
