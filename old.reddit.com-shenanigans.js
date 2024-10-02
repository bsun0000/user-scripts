// ==UserScript==
// @name         Old Reddit Sidebar Reorganizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Swaps the position of moderation_tools and titlebox on old.reddit.com as soon as they're available
// @match        https://old.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Function to swap the position of two elements
    function swapElements(elem1, elem2) {
        const parent = elem1.parentNode;
        const nextSibling = elem1.nextSibling;
        elem2.parentNode.insertBefore(elem1, elem2);
        parent.insertBefore(elem2, nextSibling);
    }

    // Function to find and swap the elements
    function findAndSwapElements() {
        const sideDiv = document.querySelector('.side');
        if (!sideDiv) return false;

        const moderationToolsSpacer = sideDiv.querySelector('.spacer:has(#moderation_tools)');
        const titleboxSpacer = sideDiv.querySelector('.spacer:has(.titlebox)');

        if (moderationToolsSpacer && titleboxSpacer) {
            swapElements(moderationToolsSpacer, titleboxSpacer);
            return true;
        }

        return false;
    }

    // Function to initialize our script
    function init() {
        // Attempt to swap elements immediately
        if (findAndSwapElements()) {
            return;
        }

        // If elements are not found, set up a MutationObserver
        const observer = new MutationObserver((mutations, obs) => {
            if (findAndSwapElements()) {
                obs.disconnect();
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Fallback: if elements are still not found after 5 seconds, stop observing
        setTimeout(() => {
            observer.disconnect();
        }, 5000);
    }

    // Run the init function when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
