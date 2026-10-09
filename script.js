const form = document.getElementById('contact-form');
const inquirySelect = document.getElementById('inquiry');
const companyCategories = [
    {
        industry: 'BPOs & KPOs',
        roles: ['Customer Support', 'Process Associates', 'Team Leaders', 'Data Entry Operators', 'Research Analysts', 'Quality Analysts']
    },
    {
        industry: 'Banking, Financial Services & Insurance (BFSI) / FinTech',
        roles: ['Relationship Managers', 'Credit Analysts', 'Branch Managers', 'FinTech Developers', 'Insurance Advisors', 'Compliance Officers']
    },
    {
        industry: 'EdTech',
        roles: ['Content Developers', 'Academic Counsellors', 'Sales Managers', 'Curriculum Designers', 'Tech Support', 'Operations Staff']
    },
    {
        industry: 'Automobile & Automotive',
        roles: ['Production Engineers', 'Quality Inspectors', 'Service Technicians', 'Sales Executives', 'R&D Engineers', 'Supply Chain']
    },
    {
        industry: 'Healthcare & Pharmaceuticals',
        roles: ['Medical Representatives', 'Hospital Administrators', 'Lab Technicians', 'Pharma Sales', 'Nursing Staff', 'Clinical Researchers']
    },
    {
        industry: 'Hospitality & FMCG',
        roles: ['Hotel Managers', 'F&B Executives', 'Sales Representatives', 'Brand Managers', 'Store Managers', 'Marketing Executives']
    },
    {
        industry: 'Manufacturing',
        roles: ['Production Supervisors', 'Quality Engineers', 'Plant Operators', 'Safety Officers', 'Maintenance Engineers', 'Supply Chain']
    },
    {
        industry: 'Retail & E-commerce',
        roles: ['Store Managers', 'Category Managers', 'Digital Marketers', 'Warehouse Operations', 'Sales Executives', 'Visual Merchandisers']
    },
    {
        industry: 'Logistics & Supply Chain Management',
        roles: ['Logistics Coordinators', 'Warehouse Managers', 'Fleet Supervisors', 'Supply Chain Analysts', 'Operations Executives', 'Dispatch Officers']
    },
    {
        industry: 'Real Estate & Construction',
        roles: ['Project Managers', 'Site Engineers', 'Sales Executives', 'Civil Engineers', 'Property Managers', 'Interior Designers']
    },
    {
        industry: 'Engineering & Industrial Services',
        roles: ['Mechanical Engineers', 'Electrical Engineers', 'Project Managers', 'Technical Supervisors', 'Safety Officers', 'Instrumentation Engineers']
    },
    {
        industry: 'Information Technology (IT) & ITES',
        roles: ['Software Engineers', 'DevOps / Cloud', 'QA Engineers', 'Data Analysts', 'Product Managers', 'Tech Leads']
    },
    {
        industry: 'Telecom',
        roles: ['Network Engineers', 'RF Engineers', 'Field Technicians', 'Sales Managers', 'Customer Support', 'Operations Executives']
    },
    {
        industry: 'Media & Entertainment',
        roles: ['Content Creators', 'Video Editors', 'Marketing Managers', 'Journalists', 'Production Staff', 'Digital Strategists']
    },
    {
        industry: 'Travel & Tourism',
        roles: ['Travel Consultants', 'Operations Executives', 'Customer Service', 'Sales Managers', 'Tour Coordinators', 'Ticketing Agents']
    },
    {
        industry: 'Facility Management',
        roles: ['Facility Managers', 'Security Supervisors', 'Housekeeping Staff', 'Maintenance Technicians', 'Operations Executives', 'Site Managers']
    },
    {
        industry: 'Startups & Emerging Businesses',
        roles: ['Business Development', 'Marketing Executives', 'Tech Developers', 'HR & Operations', 'Generalist Managers', 'Product Executives']
    }
];

const companyCategorySelect = document.getElementById('company-category');
const otherIndustryField = document.getElementById('other-industry-field');
const otherIndustryInput = document.getElementById('other-industry');
const otherIndustryRolesField = document.getElementById('other-industry-roles-field');
const otherIndustryRolesInput = document.getElementById('other-industry-roles');
const companyRoleSearchSection = document.getElementById('company-role-search-section');
const companyRoleSearch = document.getElementById('company-role-search');
const companyRolesContainer = document.getElementById('company-roles');
const selectedCompanyRoles = new Map();
const jobSeekerSection = document.getElementById('job-seeker-section');
const jobSeekerFields = jobSeekerSection.querySelectorAll('input');
const submitButton = form.querySelector('button[type="submit"]');
const formStatus = document.getElementById('form-status');

companyCategories.forEach(function (category) {
    const option = document.createElement('option');
    option.value = category.industry;
    option.textContent = category.industry;
    companyCategorySelect.appendChild(option);
});

const otherIndustryOption = document.createElement('option');
otherIndustryOption.value = 'other';
otherIndustryOption.textContent = 'Other';
companyCategorySelect.appendChild(otherIndustryOption);

function getRoleKey(industry, role) {
    return JSON.stringify([industry, role]);
}

function renderCompanyRoles() {
    const selectedIndustry = companyCategorySelect.value;
    const query = companyRoleSearch.value.trim().toLocaleLowerCase();
    const visibleCategories = companyCategories.filter(function (category) {
        if (selectedIndustry) {
            return category.industry === selectedIndustry;
        }
        return query && category.roles.some(function (role) {
            return role.toLocaleLowerCase().includes(query);
        });
    });

    companyRolesContainer.replaceChildren();

    if (selectedIndustry === 'other') {
        return;
    }

    if (!selectedIndustry && !query) {
        const prompt = document.createElement('p');
        prompt.className = 'company-roles-empty';
        prompt.textContent = 'Search for a role to see matching results across industries.';
        companyRolesContainer.appendChild(prompt);
        return;
    }

    visibleCategories.forEach(function (category, categoryIndex) {
        const matchingRoles = category.roles.filter(function (role) {
            return role.toLocaleLowerCase().includes(query);
        });

        const group = document.createElement('section');
        group.className = 'company-role-group';

        const heading = document.createElement('h3');
        heading.textContent = category.industry;
        group.appendChild(heading);

        const roleList = document.createElement('div');
        roleList.className = 'company-role-list';
        let customRoleField;

        function addRoleOption(role, roleIndex, isOtherRole) {
            const roleKey = getRoleKey(category.industry, isOtherRole ? 'Other' : role);
            const checkboxId = 'company-role-' + categoryIndex + '-' + roleIndex;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;
            checkbox.value = isOtherRole ? 'Other' : role;
            checkbox.dataset.industry = category.industry;
            checkbox.checked = selectedCompanyRoles.has(roleKey);

            const label = document.createElement('label');
            label.className = 'company-role-option';
            label.htmlFor = checkboxId;
            label.append(checkbox, document.createTextNode(isOtherRole ? 'Other' : role));
            roleList.appendChild(label);

            if (isOtherRole) {
                customRoleField = document.createElement('div');
                customRoleField.className = 'field';
                customRoleField.hidden = !checkbox.checked;

                const customRoleLabel = document.createElement('label');
                customRoleLabel.htmlFor = checkboxId + '-text';
                customRoleLabel.textContent = 'Specify the role you are looking for *';

                const customRoleInput = document.createElement('input');
                customRoleInput.type = 'text';
                customRoleInput.id = checkboxId + '-text';
                customRoleInput.placeholder = 'Role name';
                customRoleInput.dataset.otherRoleFor = roleKey;
                customRoleInput.required = checkbox.checked;
                customRoleInput.value = selectedCompanyRoles.get(roleKey)?.customRole || '';
                customRoleField.append(customRoleLabel, customRoleInput);
            }
        }

        matchingRoles.forEach(function (role, roleIndex) {
            addRoleOption(role, roleIndex, false);
        });
        addRoleOption('Other', category.roles.length, true);

        group.appendChild(roleList);
        if (customRoleField) {
            group.appendChild(customRoleField);
        }
        companyRolesContainer.appendChild(group);
    });
}

companyCategorySelect.addEventListener('change', function () {
    const isOtherIndustry = companyCategorySelect.value === 'other';
    otherIndustryField.hidden = !isOtherIndustry;
    otherIndustryInput.required = isOtherIndustry;
    otherIndustryRolesField.hidden = !isOtherIndustry;
    otherIndustryRolesInput.required = isOtherIndustry;
    companyRoleSearchSection.hidden = isOtherIndustry;
    renderCompanyRoles();
});
companyRoleSearch.addEventListener('input', renderCompanyRoles);
companyRolesContainer.addEventListener('change', function (event) {
    const checkbox = event.target;
    if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== 'checkbox') {
        return;
    }

    const roleKey = getRoleKey(checkbox.dataset.industry, checkbox.value);
    if (checkbox.checked) {
        selectedCompanyRoles.set(roleKey, {
            industry: checkbox.dataset.industry,
            role: checkbox.value,
            customRole: ''
        });
    } else {
        selectedCompanyRoles.delete(roleKey);
    }
    renderCompanyRoles();
});
companyRolesContainer.addEventListener('input', function (event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.dataset.otherRoleFor) {
        return;
    }

    const selection = selectedCompanyRoles.get(input.dataset.otherRoleFor);
    if (selection) {
        selection.customRole = input.value;
    }
});

renderCompanyRoles();

function updateInquiryFields() {
    const selectedInquiry = inquirySelect.value;
    const companyDetails = document.getElementById('company-details-section');
    const isHiring = selectedInquiry === 'hire-talent';
    const isLookingForJob = selectedInquiry === 'looking-for-job';

    companyDetails.hidden = !isHiring;
    companyCategorySelect.required = isHiring;
    jobSeekerSection.hidden = !isLookingForJob;
    jobSeekerFields.forEach(function (field) {
        field.required = isLookingForJob;
    });
    if (!isHiring) {
        companyCategorySelect.value = '';
        otherIndustryInput.value = '';
        otherIndustryInput.required = false;
        otherIndustryRolesInput.value = '';
        otherIndustryRolesInput.required = false;
        otherIndustryField.hidden = true;
        otherIndustryRolesField.hidden = true;
        companyRoleSearchSection.hidden = false;
        selectedCompanyRoles.clear();
        renderCompanyRoles();
    }
}

inquirySelect.addEventListener('change', function () {
    updateInquiryFields();
});

updateInquiryFields();

form.addEventListener('reset', function () {
    window.setTimeout(function () {
        selectedCompanyRoles.clear();
        otherIndustryInput.value = '';
        otherIndustryRolesInput.value = '';
        otherIndustryField.hidden = true;
        otherIndustryRolesField.hidden = true;
        otherIndustryInput.required = false;
        otherIndustryRolesInput.required = false;
        companyRoleSearchSection.hidden = false;
        renderCompanyRoles();
        updateInquiryFields();
    }, 0);
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedInquiry = inquirySelect.value;
    const isHiring = selectedInquiry === 'hire-talent';
    const isLookingForJob = selectedInquiry === 'looking-for-job';
    const formData = {
        name: document.getElementById('full-name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        age: isLookingForJob ? document.getElementById('job-seeker-age').value : '',
        inquiry: selectedInquiry,
        yearsExperience: isLookingForJob ? document.getElementById('years-experience').value : '',
        role: isLookingForJob ? document.getElementById('job-role').value : '',
        location: isLookingForJob ? document.getElementById('job-location').value : '',
        expectedCtc: isLookingForJob ? document.getElementById('expected-ctc').value : '',
        noticePeriod: isLookingForJob ? document.getElementById('notice-period').value : '',
        companyDetails: {
            categories: isHiring
                ? (companyCategorySelect.value === 'other'
                    ? [otherIndustryInput.value.trim()]
                    : Array.from(new Set(Array.from(selectedCompanyRoles.values(), function (selection) {
                        return selection.industry;
                    }).concat(companyCategorySelect.value ? [companyCategorySelect.value] : []))))
                : [],
            roles: isHiring
                ? (companyCategorySelect.value === 'other'
                    ? [otherIndustryInput.value.trim() + ': ' + otherIndustryRolesInput.value.trim()]
                    : Array.from(selectedCompanyRoles.values(), function (selection) {
                        return selection.industry + ': ' + (selection.role === 'Other' ? selection.customRole : selection.role);
                    }))
                : []
        },
        jobInternType: '',
        message: ''
    };

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxKMkBcICQn12sJG4COlVWJfPza16NPFITVRdcrsykxAdVrk8jHD_FM-TasTj3S1Rsh/exec';

    submitButton.disabled = true;
    formStatus.textContent = 'Submitting...';
    formStatus.classList.remove('is-error');

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8'
        },
        body: JSON.stringify(formData)
    })
        .then(function () {
            form.reset();
            formStatus.textContent = 'Request sent. Google Sheets does not provide a readable response here, so delivery could not be confirmed.';
        })
        .catch(function (error) {
            console.error('Error submitting form:', error);
            formStatus.textContent = 'Unable to send your request. Please try again.';
            formStatus.classList.add('is-error');
        })
        .finally(function () {
            submitButton.disabled = false;
        });
});
