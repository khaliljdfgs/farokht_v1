import bcrypt from 'bcryptjs'
import { User } from './models/index.js'

const CreateAdmin = async () => {
  const admin = await User.findOne({ role: 'admin' })
  if (admin) {
    console.log('Admin User Already Created!')
    return
  }

  await User.create({
    firstName: 'Admin',
    lastName: 'Admin',
    phoneNumber1: '0123456789',
    password: await bcrypt.hash('Admin@123', await bcrypt.genSalt(10)),
    companyName: 'Administrator',
    location: 'Not Applicale',
    address: 'Not Applicale',
    paymentMethod: 'Not Applicale',
    bankName: 'Not Applicale',
    bankBranchCode: '0000',
    bankAccountNumber: '0000000000000',
    role: 'admin',
    status: 'approved'
  })

  console.log('New Admin User Created!')
}

export { CreateAdmin }