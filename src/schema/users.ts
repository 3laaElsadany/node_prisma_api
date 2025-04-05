import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});



export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().nullable(),
  pincode: z.string().length(6),
  country: z.string(),
  city: z.string()
});


export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional()
})

export const RoleSchema = z.object({
  role: z.enum(["ADMIN", "USER"])
})

export const StatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED","DELIVERED","CANCELED","OUT_FOR_DELIVERY"])
})



