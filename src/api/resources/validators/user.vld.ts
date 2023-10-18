// import { NextFunction, Request, Response } from 'express'

// const validateAddElectionToOrganizationInput = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { election_id } = req.body
//   const errors: { [key: string]: string } = {}

//   if (isEmpty(election_id)) errors.election_id = 'Election cannot be empty'

//   if (Object.keys(errors).length > 0) {
//     return inputError(errors, res)
//   } else {
//     return next()
//   }
// }
export {};
