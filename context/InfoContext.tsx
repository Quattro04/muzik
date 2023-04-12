import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface InfoCtx {
    isIos: boolean;
    browser: string;
};

const InfoContext = createContext<InfoCtx>(
    {
        isIos: false,
        browser: ''
    }
);

export function InfoContextProvider({ children }: { children: ReactNode }) {

    const [isIos, setIsIos] = useState<boolean>(false);
    const [browser, setBrowser] = useState<string>('');

    const iOS = () => {
        return [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
        ].includes(navigator.userAgent)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      }
      
    const getBrowser = () => {
        let currentBrowser = 'Not known';
        if (window.navigator.userAgent.indexOf('Chrome') !== -1) { currentBrowser = 'Google Chrome'; }
        else if (window.navigator.userAgent.indexOf('Firefox') !== -1) { currentBrowser = 'Mozilla Firefox'; }
        else if (window.navigator.userAgent.indexOf('MSIE') !== -1) { currentBrowser = 'Internet Exployer'; }
        else if (window.navigator.userAgent.indexOf('Edge') !== -1) { currentBrowser = 'Edge'; }
        else if (window.navigator.userAgent.indexOf('Safari') !== -1) { currentBrowser = 'Safari'; }
        else if (window.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'Opera'; }
        else if (window.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'YaBrowser'; }
        else { console.log('Others'); }
        
        return currentBrowser;
    }

    useEffect(() => {
        setIsIos(iOS);
        setBrowser(getBrowser);
    }, [])

    return (
        <InfoContext.Provider
            value={{
                isIos,
                browser
            }}
        >
            {children}
        </InfoContext.Provider>
    );

};

export function useInfo() {
    const context = useContext(InfoContext);
    if (context === undefined) {
        throw new Error("Context must be used within a Provider");
    }
    return context;
}