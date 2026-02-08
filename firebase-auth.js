// ============================================
// نظام المصادقة (Authentication) الكامل
// ============================================

// رسائل الأخطاء بالعربية
const errorMessages = {
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل',
    'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
    'auth/operation-not-allowed': 'هذه العملية غير مسموح بها',
    'auth/weak-password': 'كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل)',
    'auth/user-disabled': 'هذا الحساب معطل',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/too-many-requests': 'محاولات كثيرة جداً، حاول مرة أخرى لاحقاً',
    'auth/network-request-failed': 'خطأ في الاتصال بالإنترنت',
    'auth/popup-closed-by-user': 'تم إغلاق النافذة المنبثقة',
    'auth/cancelled-popup-request': 'تم إلغاء الطلب',
    'auth/popup-blocked': 'المتصفح منع النافذة المنبثقة'
};

// دالة للحصول على رسالة الخطأ بالعربية
function getArabicErrorMessage(errorCode) {
    return errorMessages[errorCode] || 'حدث خطأ غير متوقع، حاول مرة أخرى';
}

// ============================================
// التسجيل بالإيميل وكلمة المرور
// ============================================
async function signUpWithEmail(email, password, displayName) {
    try {
        // إنشاء حساب جديد
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // تحديث اسم المستخدم
        await user.updateProfile({
            displayName: displayName
        });

        // إنشاء ملف المستخدم في Firestore
        await createUserProfile(user.uid, {
            email: user.email,
            displayName: displayName,
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=200`,
            provider: 'email'
        });

        // إرسال إيميل التحقق
        await user.sendEmailVerification();

        console.log('✅ تم إنشاء الحساب بنجاح');
        return {
            success: true,
            user: user,
            message: 'تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني'
        };

    } catch (error) {
        console.error('❌ خطأ في التسجيل:', error);
        return {
            success: false,
            error: error.code,
            message: getArabicErrorMessage(error.code)
        };
    }
}

// ============================================
// تسجيل الدخول بالإيميل وكلمة المرور
// ============================================
async function signInWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log('✅ تم تسجيل الدخول بنجاح');
        return {
            success: true,
            user: user,
            message: 'مرحباً بك مرة أخرى!'
        };

    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        return {
            success: false,
            error: error.code,
            message: getArabicErrorMessage(error.code)
        };
    }
}

// ============================================
// تسجيل الدخول بحساب Google
// ============================================
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // التحقق من وجود ملف المستخدم
        const userProfile = await getUserProfile(user.uid);

        // إذا لم يكن موجود، أنشئه
        if (!userProfile) {
            await createUserProfile(user.uid, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                provider: 'google'
            });
        }

        console.log('✅ تم تسجيل الدخول بـ Google بنجاح');
        return {
            success: true,
            user: user,
            message: 'مرحباً بك!'
        };

    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول بـ Google:', error);
        return {
            success: false,
            error: error.code,
            message: getArabicErrorMessage(error.code)
        };
    }
}

// ============================================
// تسجيل الخروج
// ============================================
async function signOut() {
    try {
        await auth.signOut();
        console.log('✅ تم تسجيل الخروج بنجاح');
        return {
            success: true,
            message: 'تم تسجيل الخروج بنجاح'
        };
    } catch (error) {
        console.error('❌ خطأ في تسجيل الخروج:', error);
        return {
            success: false,
            message: 'حدث خطأ في تسجيل الخروج'
        };
    }
}

// ============================================
// إعادة تعيين كلمة المرور
// ============================================
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        console.log('✅ تم إرسال رابط إعادة تعيين كلمة المرور');
        return {
            success: true,
            message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        };
    } catch (error) {
        console.error('❌ خطأ في إعادة تعيين كلمة المرور:', error);
        return {
            success: false,
            message: getArabicErrorMessage(error.code)
        };
    }
}

// ============================================
// مراقبة حالة المصادقة
// ============================================
function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // المستخدم مسجل دخول
            const userProfile = await getUserProfile(user.uid);
            callback({
                isLoggedIn: true,
                user: user,
                profile: userProfile
            });
        } else {
            // المستخدم غير مسجل دخول
            callback({
                isLoggedIn: false,
                user: null,
                profile: null
            });
        }
    });
}

// ============================================
// الحصول على المستخدم الحالي
// ============================================
function getCurrentUser() {
    return auth.currentUser;
}

// ============================================
// التحقق من حالة تسجيل الدخول
// ============================================
function isUserLoggedIn() {
    return auth.currentUser !== null;
}

// ============================================
// تحديث الملف الشخصي
// ============================================
async function updateUserProfileData(displayName, photoURL) {
    try {
        const user = auth.currentUser;

        if (!user) {
            return {
                success: false,
                message: 'يجب تسجيل الدخول أولاً'
            };
        }

        // تحديث في Firebase Auth
        await user.updateProfile({
            displayName: displayName,
            photoURL: photoURL
        });

        // تحديث في Firestore
        await updateUserProfile(user.uid, {
            displayName: displayName,
            photoURL: photoURL
        });

        console.log('✅ تم تحديث الملف الشخصي بنجاح');
        return {
            success: true,
            message: 'تم تحديث ملفك الشخصي بنجاح'
        };

    } catch (error) {
        console.error('❌ خطأ في تحديث الملف الشخصي:', error);
        return {
            success: false,
            message: 'حدث خطأ في تحديث الملف الشخصي'
        };
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.signUpWithEmail = signUpWithEmail;
window.signInWithEmail = signInWithEmail;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.resetPassword = resetPassword;
window.onAuthStateChanged = onAuthStateChanged;
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;
window.updateUserProfileData = updateUserProfileData;

// ============================================
// تهيئة واجهة المستخدم عند تحميل الصفحة
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // مراقبة حالة تسجيل الدخول
    onAuthStateChanged((authState) => {
        updateUIBasedOnAuthState(authState);
    });
});

// دالة لتحديث واجهة المستخدم بناءً على حالة المصادقة
function updateUIBasedOnAuthState(authState) {
    const loginBtn = document.getElementById('loginBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (authState.isLoggedIn) {
        // المستخدم مسجل دخول
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfileBtn) userProfileBtn.style.display = 'flex';

        if (userAvatar) {
            userAvatar.src = authState.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authState.user.displayName || 'User')}&background=6366f1&color=fff&size=200`;
        }

        if (userName) {
            userName.textContent = authState.user.displayName || 'مستخدم';
        }

        console.log('👤 المستخدم:', authState.user.displayName);
    } else {
        // المستخدم غير مسجل دخول
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfileBtn) userProfileBtn.style.display = 'none';

        console.log('👤 لا يوجد مستخدم مسجل دخول');
    }
}
