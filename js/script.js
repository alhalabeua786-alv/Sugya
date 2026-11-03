
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. دوال مساعدة للتخزين
    // =====================================

    function getData(key, fallback = []) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return data ?? fallback;
        } catch (error) {
            return fallback;
        }
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function showMessage(id, message, success = true) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = message;
            element.style.color = success ? "#15803d" : "#dc2626";
        }
    }


    // =====================================
    // 2. تسجيل الدخول وإنشاء الحساب
    // =====================================

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");

    const showRegister = document.getElementById("showRegister");
    const cancelRegister = document.getElementById("cancelRegister");

    // إظهار إنشاء الحساب

    if (showRegister) {
        showRegister.addEventListener("click", function () {

            if (loginSection) loginSection.hidden = true;
            if (registerSection) registerSection.hidden = false;

            showMessage("authMessage", "");
        });
    }

    // الرجوع لتسجيل الدخول

    if (cancelRegister) {
        cancelRegister.addEventListener("click", function () {

            if (registerForm) registerForm.reset();

            if (registerSection) registerSection.hidden = true;
            if (loginSection) loginSection.hidden = false;

            showMessage("authMessage", "");
        });
    }


    // إنشاء حساب جديد

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("newName").value.trim();

            const username =
                document.getElementById("newUsername").value.trim();

            const password =
                document.getElementById("newPassword").value;

            if (!name || !username || !password) {
                showMessage("authMessage", "يرجى تعبئة جميع الحقول.", false);
                return;
            }

            const users = getData("sukiaUsers");

            const exists = users.some(function (user) {
                return user.username.toLowerCase() === username.toLowerCase();
            });

            if (exists) {
                showMessage("authMessage", "اسم المستخدم مسجل من قبل.", false);
                return;
            }

            users.push({
                name: name,
                username: username,
                password: password
            });

            saveData("sukiaUsers", users);

            registerForm.reset();

            if (registerSection) registerSection.hidden = true;
            if (loginSection) loginSection.hidden = false;

            const usernameField = document.getElementById("username");

            if (usernameField) {
                usernameField.value = username;
            }

            showMessage(
                "authMessage",
                "تم إنشاء الحساب بنجاح. أدخلي كلمة المرور لتسجيل الدخول."
            );

        });

    }


    // تسجيل الدخول التجريبي

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const username =
                document.getElementById("username").value.trim();

            const password =
                document.getElementById("password").value;

            if (!username || !password) {
                showMessage(
                    "authMessage",
                    "اكتبي اسم المستخدم وكلمة المرور.",
                    false
                );
                return;
            }

            // دخول تجريبي بأي بيانات غير فارغة

            localStorage.setItem("sugiaLoggedIn", "true");
            localStorage.setItem("sugiaUsername", username);

            window.location.href = "home.html";

        });

    }


    // =====================================
    // 3. حماية الصفحات الداخلية
    // =====================================

    const isProtected =
        document.body.dataset.protected === "true";

    const loggedIn =
        localStorage.getItem("sugiaLoggedIn") === "true";

    if (isProtected && !loggedIn) {

        window.location.replace("index.html");
        return;

    }


    // =====================================
    // 4. الهامبرغر
    // =====================================

    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    if (menuButton && menu) {

        menuButton.addEventListener("click", function (event) {

            event.stopPropagation();

            const isOpen = menu.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        document.addEventListener("click", function (event) {

            if (
                !menu.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                menu.classList.remove("open");

                menuButton.setAttribute("aria-expanded", "false");

            }

        });

    }


    // =====================================
    // 5. تسجيل الخروج
    // =====================================

    const confirmLogout =
        document.getElementById("confirmLogout");

    if (confirmLogout) {

        confirmLogout.addEventListener("click", function () {

            localStorage.removeItem("sugiaLoggedIn");
            localStorage.removeItem("sugiaUsername");

            showMessage(
                "logoutMessage",
                "تم تسجيل الخروج بنجاح."
            );

            window.location.href = "index.html";

        });

    }


    // =====================================
    // 6. طلب المياه
    // =====================================

    const bookingForm =
        document.getElementById("bookingForm");

    if (bookingForm) {

        bookingForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const getValue = function (id) {
                const element = document.getElementById(id);
                return element ? element.value.trim() : "";
            };

            const customerName = getValue("customerName");
            const customerEmail = getValue("customerEmail");
            const customerPhone = getValue("customerPhone");

            const serviceType = getValue("serviceType");
            const tankerCount = getValue("tankerCount");

            const city = getValue("city");
            const locality = getValue("locality");
            const neighborhood = getValue("neighborhood");
            const houseNumber = getValue("houseNumber");
            const locationDetails = getValue("locationDetails");

            const fullAddress = [
                city,
                locality,
                neighborhood,
                houseNumber,
                locationDetails
            ].filter(Boolean).join(" - ");

            const addressField =
                document.getElementById("customerAddress");

            if (addressField) {
                addressField.value = fullAddress;
            }

            const order = {

                number: "SK-" + Date.now(),

                name: customerName,
                email: customerEmail,
                phone: customerPhone,

                service: serviceType,
                tankerCount: tankerCount,

                city: city,
                locality: locality,
                neighborhood: neighborhood,
                houseNumber: houseNumber,
                locationDetails: locationDetails,

                address: fullAddress,

                status: "قيد المراجعة",

                date: new Date().toLocaleDateString("ar")

            };

            const orders = getData("sugiaOrders");

            orders.push(order);

            saveData("sugiaOrders", orders);

            showMessage(
                "bookingMessage",
                "تم إرسال طلبك بنجاح! رقم الطلب: " + order.number
            );

            bookingForm.reset();

        });

    }


    // =====================================
    // 7. الشكاوى والبلاغات
    // =====================================

    const complaintForm =
        document.getElementById("complaintForm");

    if (complaintForm) {

        complaintForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const getValue = function (id) {
                const element = document.getElementById(id);
                return element ? element.value.trim() : "";
            };

            const complaint = {

                number: "SH-" + Date.now(),

                name: getValue("complaintName"),

                type: getValue("complaintType"),

                details: getValue("complaintDetails"),

                phone: getValue("complaintPhone"),

                priority: getValue("complaintPriority"),

                address: getValue("complaintAddress"),

                date: new Date().toLocaleDateString("ar")

            };

            const complaints = getData("sugiaComplaints");

            complaints.push(complaint);

            saveData("sugiaComplaints", complaints);

            showMessage(
                "complaintMessage",
                "تم حفظ البلاغ بنجاح. رقم البلاغ: " + complaint.number
            );

            complaintForm.reset();

        });

    }


    // =====================================
    // 8. متابعة الطلبات
    // =====================================

    const trackingForm =
        document.getElementById("trackingForm");

    if (trackingForm) {

        trackingForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const number =
                document.getElementById("orderNumber").value.trim();

            const orders = getData("sugiaOrders");

            const order = orders.find(function (item) {
                return item.number === number;
            });

            const result =
                document.getElementById("trackingResult");

            if (!result) return;

            if (order) {

                result.textContent =
                    "رقم الطلب: " + order.number +
                    " | نوع الخدمة: " + order.service +
                    " | عدد الصهاريج: " + (order.tankerCount || "غير محدد") +
                    " | العنوان: " + (order.address || "غير محدد") +
                    " | الحالة: " + order.status;

            } else {

                result.textContent =
                    "لم يتم العثور على طلب بهذا الرقم.";

            }

        });

    }


    // =====================================
    // 9. التواصل معنا
    // =====================================

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const getValue = function (id) {
                const element = document.getElementById(id);
                return element ? element.value.trim() : "";
            };

            const contactMessage = {

                name: getValue("contactName"),

                email: getValue("contactEmail"),

                subject: getValue("contactSubject"),

                message: getValue("contactMessageText"),

                date: new Date().toLocaleDateString("ar")

            };

            if (
                !contactMessage.name ||
                !contactMessage.email ||
                !contactMessage.message
            ) {

                showMessage(
                    "contactStatus",
                    "يرجى تعبئة الحقول المطلوبة.",
                    false
                );

                return;

            }

            const messages = getData("sugiaMessages");

            messages.push(contactMessage);

            saveData("sugiaMessages", messages);

            showMessage(
                "contactStatus",
                "تم حفظ رسالتك تجريبياً بنجاح."
            );

            contactForm.reset();

        });

    }





  
    // =====================================
    // 10. الوضع الليلي
    // =====================================

    const themeToggle =
        document.getElementById("themeToggle");

    function applyTheme() {
        const dark =
            localStorage.getItem("sugiaTheme") === "dark";

        const language =
            localStorage.getItem("sugiaLanguage") || "ar";

        document.documentElement.classList.toggle(
            "dark-mode",
            dark
        );

        if (themeToggle) {
            if (dark) {
                themeToggle.textContent =
                    language === "ar"
                        ? "☀️ الوضع النهاري"
                        : "☀️ Light Mode";
            } else {
                themeToggle.textContent =
                    language === "ar"
                        ? "🌙 الوضع الليلي"
                        : "🌙 Dark Mode";
            }
        }
    }

    applyTheme();

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const dark =
                !document.documentElement.classList.contains("dark-mode");

            localStorage.setItem(
                "sugiaTheme",
                dark ? "dark" : "light"
            );

            applyTheme();
        });
    }


    // =====================================
    // 11. تغيير اللغة
    // =====================================

    const languageToggle =
        document.getElementById("languageToggle");

    function applyLanguage(language) {

        document.documentElement.lang = language;

        document.documentElement.dir =
            language === "ar" ? "rtl" : "ltr";

        document.querySelectorAll("[data-ar][data-en]").forEach(
            function (element) {

                element.textContent =
                    language === "ar"
                        ? element.dataset.ar
                        : element.dataset.en;

            }
        );

        if (languageToggle) {

            languageToggle.textContent =
                language === "ar"
                    ? "🌐 English"
                    : "🌐 العربية";

        }

        localStorage.setItem("sugiaLanguage", language);

    }
          applyTheme();

    const savedLanguage =
        localStorage.getItem("sugiaLanguage") || "ar";

    applyLanguage(savedLanguage);

    if (languageToggle) {

        languageToggle.addEventListener("click", function () {

            const current =
                localStorage.getItem("sugiaLanguage") || "ar";

            applyLanguage(
                current === "ar" ? "en" : "ar"
            );

        });

    }

});
