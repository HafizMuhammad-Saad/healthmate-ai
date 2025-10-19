export    const validateEmail = (email) => {
        if (!email.trim()) return 'Email is required'
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) return 'Please Enter a valid email address';
        return '';
    }

export    const validatePassword = (password) => {
        if (!password) return 'Password is required'
        if (password.length < 8) return 'Password must be at least 8 characters long';
        if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least';
        if (!/(?=.*[0-9])/.test(password)) return 'Password must contain at least one number';
    return "";
    };

    export const validateAvatar = (file) => {
        if (!file) return '' //avatar is optional

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) return 'Only image files are allowed';

        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {return 'File size should be less than 5MB'};

        return '';
    }

    export const getInitials = (name) => {
        return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };