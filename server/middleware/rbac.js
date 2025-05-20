import { ForbiddenError } from '../utils/errors.js';

// Role-based middleware
export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};

// Group moderation middleware
export const checkGroupModeration = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const user = await req.user.populate('profile');

        // Allow access if user is admin or an approved doctor assigned to the group
        if (user.role === 'admin' ||
            (user.role === 'doctor' &&
                user.profile.isApproved &&
                user.profile.assignedGroups?.includes(groupId))) {
            next();
        } else {
            throw new ForbiddenError('Not authorized to moderate this group');
        }
    } catch (error) {
        next(error);
    }
};

// Article permissions middleware
export const checkArticlePermissions = async (req, res, next) => {
    try {
        const user = await req.user.populate('profile');

        // Allow access if user is admin or an approved doctor
        if (user.role === 'admin' ||
            (user.role === 'doctor' &&
                user.profile.isApproved &&
                (user.profile.canPublishWithoutApproval || req.method === 'POST'))) {
            next();
        } else {
            throw new ForbiddenError('Not authorized to perform this action');
        }
    } catch (error) {
        next(error);
    }
};

// Content moderation middleware
export const checkContentModeration = async (req, res, next) => {
    try {
        const user = await req.user.populate('profile');

        // Allow access if user is admin or an approved doctor
        if (user.role === 'admin' ||
            (user.role === 'doctor' && user.profile.isApproved)) {
            next();
        } else {
            throw new ForbiddenError('Not authorized to moderate content');
        }
    } catch (error) {
        next(error);
    }
};