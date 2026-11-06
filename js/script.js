
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

    // الحصول على قيمة عنصر
    function getValue(id) {

        const element = document.getElementById(id);

        return element ? element.value.trim() : "";
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

            const name = getValue("newName");

            const username = getValue("newUsername");

            const password = getValue("newPassword");

            if (!name || !username || !password) {

                showMessage(
                    "authMessage",
                    "يرجى تعبئة جميع الحقول.",
                    false
                );

                return;
            }

            const users = getData("sukiaUsers");

            const exists = users.some(function (user) {

                return user.username.toLowerCase() ===
                    username.toLowerCase();

            });

            if (exists) {

                showMessage(
                    "authMessage",
                    "اسم المستخدم مسجل من قبل.",
                    false
                );

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

            const usernameField =
                document.getElementById("username");

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

            const username = getValue("username");

            const password = getValue("password");

            if (!username || !password) {

                showMessage(
                    "authMessage",
                    "اكتبي اسم المستخدم وكلمة المرور.",
                    false
                );

                return;
            }

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
    // 4. القائمة الرئيسية - الهامبرغر
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

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

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


            // تكوين العنوان الكامل

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


            // إنشاء الطلب

            const order = {

                number: "SK-" + Date.now(),

                // ربط الطلب بالمستخدم الحالي
                username: localStorage.getItem("sugiaUsername"),

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


            // حفظ الطلبات

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

            const complaint = {

                number: "SH-" + Date.now(),

                username: localStorage.getItem("sugiaUsername"),

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
    // 8. متابعة الطلبات وعرض التفاصيل
    // =====================================

    const ordersList =
        document.getElementById("ordersList");

    if (ordersList) {

        const currentUsername =
            localStorage.getItem("sugiaUsername");

        const allOrders = getData("sugiaOrders");


        // عرض طلبات المستخدم الحالي فقط

        const myOrders = allOrders.filter(function (order) {

            return order.username === currentUsername;

        });


        const detailsBox =
            document.getElementById("orderDetails");

        const detailsContent =
            document.getElementById("detailsContent");


        // حماية النصوص عند عرضها

        function safeText(value) {

            return String(value ?? "").replace(
                /[&<>"']/g,

                function (char) {

                    return {

                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#039;"

                    }[char];

                }
            );

        }


        // تحديد لون حالة الطلب

        function getStatusClass(status) {

            if (status === "مكتمل" || status === "تم التوصيل") {

                return "status-completed";

            }

            if (status === "مرفوض") {

                return "status-rejected";

            }

            return "status-pending";

        }


        // تحديث الإحصائيات

        function updateStatistics() {

            const total =
                document.getElementById("totalOrders");

            const pending =
                document.getElementById("pendingOrders");

            const completed =
                document.getElementById("completedOrders");


            if (total) {

                total.textContent = myOrders.length;

            }

            if (pending) {

                pending.textContent = myOrders.filter(function (order) {

                    return order.status === "قيد المراجعة";

                }).length;

            }

            if (completed) {

                completed.textContent = myOrders.filter(function (order) {

                    return order.status === "مكتمل" ||
                           order.status === "تم التوصيل";

                }).length;

            }


            const ordersCount =
                document.getElementById("ordersCount");

            if (ordersCount) {

                ordersCount.textContent =
                    myOrders.length + " طلب";

            }

        }


        // عرض قائمة الطلبات

        function displayOrders() {

            if (myOrders.length === 0) {

                ordersList.innerHTML = `

                    <div class="no-orders">

                        <span class="empty-icon">📭</span>

                        <h3>لا توجد طلبات حتى الآن</h3>

                        <p>
                            لم تقم بتقديم أي طلب مياه حتى الآن.
                            يمكنك تقديم طلب جديد من صفحة طلب المياه.
                        </p>

                        <a href="booking.html" class="btn">
                            تقديم طلب جديد
                        </a>

                    </div>

                `;

                return;

            }


            ordersList.innerHTML = myOrders.map(

                function (order, index) {

                    return `

                        <div class="order-card">

                            <div class="order-card-header">

                                <h3>💧 طلب مياه</h3>

                                <span class="order-status
                                    ${getStatusClass(order.status)}">

                                    ${safeText(
                                        order.status || "قيد المراجعة"
                                    )}

                                </span>

                            </div>


                            <div class="order-number">

                                رقم الطلب:
                                ${safeText(order.number)}

                            </div>


                            <div class="order-info">

                                <div>
                                    📅 تاريخ الطلب:
                                    ${safeText(order.date || "غير محدد")}
                                </div>

                                <div>
                                    📍 العنوان:
                                    ${safeText(order.address || "غير محدد")}
                                </div>

                                <div>
                                    🚛 عدد الصهاريج:
                                    ${safeText(order.tankerCount || "غير محدد")}
                                </div>

                            </div>


                            <button
                                class="view-order-btn"
                                data-order-index="${index}"
                                type="button">

                                عرض تفاصيل الطلب ←

                            </button>

                        </div>

                    `;

                }

            ).join("");

        }


        // عرض تفاصيل الطلب

        function showOrderDetails(order) {

            detailsContent.innerHTML = `

                <div class="details-status">

                    <strong>حالة الطلب الحالية</strong>

                    <p>

                        <span class="order-status
                            ${getStatusClass(order.status)}">

                            ${safeText(
                                order.status || "قيد المراجعة"
                            )}

                        </span>

                    </p>

                    <p>
                        رقم الطلب:
                        ${safeText(order.number)}
                    </p>

                </div>


                <div class="detail-group">

                    <h3>👤 البيانات الشخصية</h3>

                    <div class="detail-row">

                        <span>الاسم</span>

                        <strong>
                            ${safeText(order.name || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>البريد الإلكتروني</span>

                        <strong>
                            ${safeText(order.email || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>رقم الهاتف</span>

                        <strong>
                            ${safeText(order.phone || "غير محدد")}
                        </strong>

                    </div>

                </div>


                <div class="detail-group">

                    <h3>🚛 بيانات الخدمة</h3>

                    <div class="detail-row">

                        <span>نوع الخدمة</span>

                        <strong>
                            ${safeText(order.service || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>عدد الصهاريج</span>

                        <strong>
                            ${safeText(order.tankerCount || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>تاريخ تقديم الطلب</span>

                        <strong>
                            ${safeText(order.date || "غير محدد")}
                        </strong>

                    </div>

                </div>


                <div class="detail-group">

                    <h3>📍 عنوان التوصيل</h3>

                    <div class="detail-row">

                        <span>المدينة</span>

                        <strong>
                            ${safeText(order.city || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>المحلية</span>

                        <strong>
                            ${safeText(order.locality || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>الحي</span>

                        <strong>
                            ${safeText(order.neighborhood || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>رقم المنزل</span>

                        <strong>
                            ${safeText(order.houseNumber || "غير محدد")}
                        </strong>

                    </div>

                    <div class="detail-row">

                        <span>تفاصيل الموقع</span>

                        <strong>
                            ${safeText(
                                order.locationDetails || "لا توجد"
                            )}
                        </strong>

                    </div>

                </div>

            `;


            detailsBox.hidden = false;


            // الانتقال تلقائياً إلى التفاصيل

            detailsBox.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }


        // الضغط على زر عرض التفاصيل

        ordersList.addEventListener("click", function (event) {

            const button =
                event.target.closest(".view-order-btn");

            if (!button) return;


            const index =
                Number(button.dataset.orderIndex);

            const selectedOrder = myOrders[index];


            if (selectedOrder) {

                showOrderDetails(selectedOrder);

            }

        });


        // إغلاق تفاصيل الطلب

        const closeDetails =
            document.getElementById("closeDetails");

        if (closeDetails) {

            closeDetails.addEventListener("click", function () {

                detailsBox.hidden = true;

            });

        }


        // تشغيل الصفحة

        updateStatistics();

        displayOrders();

    }


    // =====================================
    // 9. التواصل معنا
    // =====================================

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();


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

            themeToggle.textContent = dark

                ? (language === "ar"
                    ? "☀️ الوضع النهاري"
                    : "☀️ Light Mode")

                : (language === "ar"
                    ? "🌙 الوضع الليلي"
                    : "🌙 Dark Mode");

        }

    }


    applyTheme();


    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            const dark =
                !document.documentElement.classList.contains(
                    "dark-mode"
                );


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


        // تغيير النصوص التي تحتوي على data-ar و data-en

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


        applyTheme();

    }


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
