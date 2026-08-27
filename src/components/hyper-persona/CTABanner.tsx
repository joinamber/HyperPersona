import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CTABannerProps {
  copyEmailToClipboard: () => void;
}

const CTABanner = ({ copyEmailToClipboard }: CTABannerProps) => {
  return (
    <div className="bg-primary py-16 md:py-20 mt-4">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl text-primary-foreground mb-4">Ready to meet your customers?</h2>
        <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-2xl mx-auto font-light">
          Join the makers and small teams using HyperPersona to understand who they're building for — before writing a line of code, or a line of ad copy.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90 text-base px-8 py-6 h-auto font-medium">
              Say Hello
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Get in touch</AlertDialogTitle>
              <AlertDialogDescription>
                We'd love to hear what you're building. Reach us at:
                <div className="mt-4 p-4 bg-accent rounded-md">
                  <div className="text-lg font-medium text-accent-foreground">hello@coaltlab.com</div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={copyEmailToClipboard}>
                Copy Email
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CTABanner;