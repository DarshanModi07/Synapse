import prisma from "../DB/db.config.js";

/**
 * Validates if the user manages the given department.
 */
export const validateManagerDepartmentOwnership = async (userId, departmentId) => {
    const department = await prisma.department.findUnique({
        where: { id: departmentId }
    });

    if (!department) {
        return { authorized: false, message: "Department not found" };
    }

    if (department.managerId !== userId) {
        return { authorized: false, message: "You are not authorized to manage this department" };
    }

    return { authorized: true, department };
};

/**
 * Returns a filter object for departments based on user role.
 * Owner gets all. Manager gets only their own.
 */
export const getVisibleDepartmentsFilter = (userId, role) => {
    if (role === 'manager') {
        return { managerId: userId };
    }
    return {};
};
