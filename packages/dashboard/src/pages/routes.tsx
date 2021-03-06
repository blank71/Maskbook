import { Route, Routes, Navigate } from 'react-router'
import React, { lazy, Suspense } from 'react'
import { DashboardFrame } from '../components/DashboardFrame'
export enum RoutePaths {
    Welcome = '/welcome',
    Personas = '/personas',
    Wallets = '/wallets',
    WalletsTransfer = '/wallets/transfer',
    WalletsSwap = '/wallets/swap',
    WalletsRedPacket = '/wallets/red-packet',
    WalletsSell = '/wallets/sell',
    WalletsHistory = '/wallets/history',
    Settings = '/settings',
    Plugins = '/plugins',
}
const Wallets = lazy(() => import('./Wallets'))
const Welcome = lazy(() => import('./Welcome'))
const Personas = lazy(() => import('./Personas'))
const Settings = lazy(() => import('./Settings'))
const Plugins = lazy(() => import('./Plugins'))
export function Pages() {
    return (
        <Suspense fallback="loading...">
            <Routes>
                <Route path={RoutePaths.Welcome} element={<Welcome />} />
                <Route path={RoutePaths.Personas} element={frame(<Personas />)} />
                <Route path={`${RoutePaths.Wallets}/*`} element={frame(<Wallets />)} />
                <Route path={RoutePaths.Settings} element={frame(<Settings />)} />
                <Route path={RoutePaths.Plugins} element={frame(<Plugins />)} />
                <Route element={<Navigate to={RoutePaths.Personas} />} />
            </Routes>
        </Suspense>
    )
}
function frame(x: React.ReactNode) {
    return <DashboardFrame children={x} />
}
