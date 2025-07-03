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
    <div className="bg-indigo-600 py-16 mt-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your User Research?</h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join forward-thinking companies using AI-powered personas to gain deeper insights, faster and more affordably.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-6 h-auto font-semibold">
              Contact Us Today
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Get in Touch</AlertDialogTitle>
              <AlertDialogDescription>
                Ready to transform your user research? Contact us at:
                <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                  <div className="text-lg font-semibold text-indigo-600">hello@coaltlab.com</div>
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