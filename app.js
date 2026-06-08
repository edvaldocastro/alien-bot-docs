'use strict';

const search = document.querySelector('#command-search');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const cards = [...document.querySelectorAll('[data-command-card]')];
const categorySections = [
    ...document.querySelectorAll('[data-category-section]'),
];
const roleSections = [...document.querySelectorAll('[data-role-section]')];
const chips = [...document.querySelectorAll('[data-filter-type]')];
let activeFilter = { type: 'all', value: 'all' };

function applyFilters() {
    const query = (search?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    for (const card of cards) {
        const matchesQuery = !query || card.dataset.search.includes(query);
        const matchesFilter =
            activeFilter.type === 'all' ||
            card.dataset[activeFilter.type] === activeFilter.value;
        const visible = matchesQuery && matchesFilter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
    }

    for (const section of categorySections) {
        section.hidden = !section.querySelector(
            '[data-command-card]:not([hidden])',
        );
    }

    for (const section of roleSections) {
        section.hidden = !section.querySelector(
            '[data-command-card]:not([hidden])',
        );
    }

    if (resultCount) resultCount.textContent = String(visibleCount);
    if (emptyState) emptyState.hidden = visibleCount !== 0;
}

search?.addEventListener('input', applyFilters);

for (const chip of chips) {
    chip.addEventListener('click', () => {
        activeFilter = {
            type: chip.dataset.filterType,
            value: chip.dataset.filterValue,
        };
        chips.forEach((item) =>
            item.classList.toggle('is-active', item === chip),
        );
        applyFilters();
    });
}

for (const button of document.querySelectorAll('[data-copy]')) {
    button.addEventListener('click', async () => {
        const original = button.textContent;
        try {
            await navigator.clipboard.writeText(button.dataset.copy);
            button.textContent = 'Copiado';
        } catch {
            button.textContent = 'Selecione o texto';
        }
        setTimeout(() => {
            button.textContent = original;
        }, 1200);
    });
}

applyFilters();
