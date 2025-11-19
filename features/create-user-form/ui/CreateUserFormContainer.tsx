import { useCreateUserForm } from '../model/useCreateUserForm'
import { CreateUserFormView } from './CreateUserFormView'

export function CreateUserFormContainer() {
  const { formik, successMessage, errorMessage, loading } = useCreateUserForm()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Create user</h1>
        <p className="text-white/70 text-base">Fill out the fields below to create a new Employee or Admin account.</p>
      </div>

      <CreateUserFormView formik={formik} successMessage={successMessage} errorMessage={errorMessage} loading={loading} />
    </div>
  )
}

