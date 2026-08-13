(function () {
  "use strict";

  var SITE = RWG.site;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function escapeHtml(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---------- Contact data (WhatsApp 233547642937) ---------- */
  function applyContact() {
    var wa = "https://wa.me/" + SITE.whatsapp;
    $$("[data-contact='whatsapp']").forEach(function (el) { el.href = wa; });
    var tel = $("[data-contact='tel']");
    if (tel) tel.href = "tel:" + SITE.phoneRaw;
    var mail = $("[data-contact='email']");
    if (mail) mail.href = "mailto:" + SITE.email;
    $$("[data-contact='phone-display']").forEach(function (el) { el.textContent = SITE.phoneDisplay; });
    var mailDisplay = $("[data-contact='email-display']");
    if (mailDisplay) mailDisplay.textContent = SITE.email;
    var loc = $("[data-contact='location']");
    if (loc) loc.textContent = SITE.location;

  }

  /* ---------- Profile ---------- */
  function renderProfile() {
    var intro = $("#profile-intro");
    if (intro) intro.textContent = RWG.profile.intro;
    var paras = $("#profile-paragraphs");
    if (paras) paras.innerHTML = RWG.profile.paragraphs.map(function (p) { return "<p>" + escapeHtml(p) + "</p>"; }).join("");
    var points = $("#profile-points");
    if (points) points.innerHTML = RWG.profile.points.map(function (p) { return "<li>" + escapeHtml(p) + "</li>"; }).join("");
  }

  /* ---------- Problems ---------- */
  function problemHtml(problem) {
    return '<li class="pp-item"><p class="pp-problem">' + escapeHtml(problem) + '</p></li>';
  }

  function renderProblems() {
    var schools = $("#school-problems");
    if (schools) schools.innerHTML = RWG.schoolProblems.map(problemHtml).join("");
    var businesses = $("#business-problems");
    if (businesses) businesses.innerHTML = RWG.businessProblems.map(problemHtml).join("");
  }

  /* ---------- Contact form selects ---------- */
  function renderContact() {
    var audience = $("#f-audience");
    if (audience) audience.innerHTML = RWG.contact.audienceOptions.map(function (s) { return "<option>" + escapeHtml(s) + "</option>"; }).join("");
    var service = $("#f-service");
    if (service) service.innerHTML = '<option value="" selected disabled>Select a service</option>' +
      RWG.contact.serviceOptions.map(function (s) { return "<option>" + escapeHtml(s) + "</option>"; }).join("");
  }

  /* ---------- Reveal on scroll ---------- */
  var revealObserver;

  function revealChildren(group) {
    var kids = group.children;
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.transitionDelay = Math.min(i, 8) * 90 + "ms";
      kids[i].classList.add("in");
    }
  }

  function observeReveals() {
    var targets = ".reveal:not(.in), .reveal-photo:not(.in), .reveal-stagger:not(.in)";
    if (!("IntersectionObserver" in window)) {
      $$(".reveal, .reveal-photo, .reveal-stagger").forEach(function (el) {
        if (el.classList.contains("reveal-stagger")) revealChildren(el);
        else el.classList.add("in");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          revealObserver.unobserve(entry.target);
          if (entry.target.classList.contains("reveal-stagger")) revealChildren(entry.target);
          else entry.target.classList.add("in");
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    $$(targets).forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Header ---------- */
  function initHeader() {
    var header = $(".site-header");

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle("scrolled", y > 10);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    var form = $("#contact-form");
    if (!form) return;

    var fields = {
      name: $("#f-name"),
      phone: $("#f-phone"),
      audience: $("#f-audience"),
      service: $("#f-service"),
      problem: $("#f-problem")
    };

    function setInvalid(input, invalid) {
      if (!input) return;
      input.setAttribute("aria-invalid", String(invalid));
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = fields.name.value.trim();
      var phone = fields.phone.value.trim();
      var problem = fields.problem.value.trim();
      var ok = true;
      if (!name) { setInvalid(fields.name, true); fields.name.focus(); ok = false; } else { setInvalid(fields.name, false); }
      if (!phone) { setInvalid(fields.phone, true); if (ok) fields.phone.focus(); ok = false; } else { setInvalid(fields.phone, false); }
      if (!problem) { setInvalid(fields.problem, true); if (ok) fields.problem.focus(); ok = false; } else { setInvalid(fields.problem, false); }
      if (!ok) return;

      var lines = [];
      lines.push("Hello, my name is " + name + ".");
      if (fields.audience.value) lines.push("I am: " + fields.audience.value);
      if (fields.service.value) lines.push("Service needed: " + fields.service.value);
      lines.push("My problem: " + problem);
      lines.push("Phone/WhatsApp: " + phone);
      lines.push("Please send me a free proposal on how to solve it.");

      var url = "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyContact();
    renderProfile();
    renderProblems();
    renderContact();
    initHeader();
    initForm();

    var year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    observeReveals();
  });
})();
