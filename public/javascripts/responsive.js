$(document).ready(() => {
    $('#menuExpand').on('click', () => {
        $('.navbar').toggle(200);
        $('.navbarContainer').siblings().toggleClass('space', 200);
    });
});
