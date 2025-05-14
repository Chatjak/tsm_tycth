import {baseApi} from "@/stores/redux/baseApi";
import {EmployeeDto} from "@/types/EmployeeDto";



export const employeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getEmployees : builder.query<EmployeeDto[],void>({
            query : () => '/api/employee/all',
            providesTags: ['Employee'],

        }),
    })
})


export const {
    useGetEmployeesQuery,
} = employeeApi;