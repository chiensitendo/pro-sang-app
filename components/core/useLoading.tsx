import { useState, useEffect } from 'react';

export function useLoading() {

    const handleLoading = (loading: boolean) => {
        const proLoading = document.getElementById("pro-loading");
        if (proLoading) {
            if (loading) {
                if (proLoading.hasAttribute('hidden')) {
                    proLoading.removeAttribute('hidden');
                    proLoading.style.zIndex = '2000';
                }
            } else {
                if (!proLoading.hasAttribute('hidden')) {
                    proLoading.setAttribute('hidden', '');
                    proLoading.style.zIndex = '-1';
                }
            }
        }
    }

    return {
        setLoading: handleLoading
    }
}