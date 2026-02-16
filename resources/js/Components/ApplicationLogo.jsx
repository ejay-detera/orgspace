export default function ApplicationLogo(props) {
    return (
        <div {...props} className="flex items-center space-x-2">
            <img 
                src="/images/org-space-logo.svg" 
                alt="OrgSpace Logo" 
                className="h-12 w-auto"
            />
            <span className="text-2xl font-bold font-roboto-serif text-gradient-secondary-primary">OrgSpace</span>
        </div>
    );
}
