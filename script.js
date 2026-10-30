const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
function selectTab(tab, { focus = false, updateHash = true } = {}) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  if (focus) tab.focus();
  if (updateHash) history.replaceState(null, '', `#${tab.id.slice(4)}`);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectTab(tabs[next], { focus: true });
  });
});
function restoreTab() {
  const tab = tabs.find(item => `#${item.id.slice(4)}` === location.hash);
  if (tab) selectTab(tab, { updateHash: false });
}
restoreTab();
window.addEventListener('hashchange', restoreTab);
document.querySelector('#year').textContent = new Date().getFullYear();
