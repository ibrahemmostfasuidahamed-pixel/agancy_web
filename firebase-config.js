// ============================================
// إعدادات Firebase - ملف التهيئة الرئيسي
// ============================================

// ⚠️ مهم: استبدل هذه القيم ببيانات مشروعك من Firebase Console
// للحصول على هذه البيانات:
// 1. اذهب إلى https://console.firebase.google.com/
// 2. اختر مشروعك (أو أنشئ مشروع جديد)
// 3. اذهب إلى Project Settings > General
// 4. انزل لـ "Your apps" واختر Web app
// 5. انسخ الـ firebaseConfig

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// تهيئة Firebase
let app;
let auth;
let db;

try {
    // تهيئة تطبيق Firebase
    app = firebase.initializeApp(firebaseConfig);

    // تهيئة خدمة المصادقة (Authentication)
    auth = firebase.auth();

    // تهيئة قاعدة بيانات Firestore
    db = firebase.firestore();

    // تفعيل Persistence للحفاظ على حالة تسجيل الدخول
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log('✅ Firebase تم تهيئته بنجاح');
        })
        .catch((error) => {
            console.error('❌ خطأ في تفعيل Persistence:', error);
        });

    // إعدادات Firestore للعمل بشكل أفضل
    db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });

    // تفعيل الكاش للعمل بدون إنترنت
    db.enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('⚠️ Persistence فشل: عدة تبويبات مفتوحة');
            } else if (err.code == 'unimplemented') {
                console.warn('⚠️ المتصفح لا يدعم Persistence');
            }
        });

} catch (error) {
    console.error('❌ خطأ في تهيئة Firebase:', error);
}

// ============================================
// دوال مساعدة للتعامل مع Firestore
// ============================================

// دالة لإنشاء مستخدم جديد في قاعدة البيانات
async function createUserProfile(uid, userData) {
    try {
        await db.collection('users').doc(uid).set({
            ...userData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            enrolledCourses: [],
            completedLessons: [],
            preferences: {
                language: 'ar',
                notifications: true
            }
        });
        console.log('✅ تم إنشاء ملف المستخدم بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في إنشاء ملف المستخدم:', error);
        return false;
    }
}

// دالة لجلب بيانات المستخدم
async function getUserProfile(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        } else {
            console.log('⚠️ ملف المستخدم غير موجود');
            return null;
        }
    } catch (error) {
        console.error('❌ خطأ في جلب بيانات المستخدم:', error);
        return null;
    }
}

// دالة لتحديث بيانات المستخدم
async function updateUserProfile(uid, updates) {
    try {
        await db.collection('users').doc(uid).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ تم تحديث ملف المستخدم بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في تحديث ملف المستخدم:', error);
        return false;
    }
}

// دالة لتسجيل المستخدم في كورس
async function enrollInCourse(uid, courseId) {
    try {
        await db.collection('users').doc(uid).update({
            enrolledCourses: firebase.firestore.FieldValue.arrayUnion(courseId)
        });

        // تحديث عدد المسجلين في الكورس
        await db.collection('courses').doc(courseId).update({
            enrolledUsers: firebase.firestore.FieldValue.increment(1)
        });

        console.log('✅ تم التسجيل في الكورس بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في التسجيل في الكورس:', error);
        return false;
    }
}

// دالة لحفظ تقدم المستخدم
async function saveUserProgress(uid, courseId, lessonId) {
    try {
        const progressRef = db.collection('user_progress').doc(`${uid}_${courseId}`);

        await progressRef.set({
            userId: uid,
            courseId: courseId,
            completedLessons: firebase.firestore.FieldValue.arrayUnion(lessonId),
            lastAccessed: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log('✅ تم حفظ التقدم بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في حفظ التقدم:', error);
        return false;
    }
}

// تصدير المتغيرات والدوال للاستخدام في ملفات أخرى
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.createUserProfile = createUserProfile;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;
window.enrollInCourse = enrollInCourse;
window.saveUserProgress = saveUserProgress;
