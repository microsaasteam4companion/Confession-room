import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, EyeOff, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8">
            <PageMeta
                title="Privacy Policy | Secret Room"
                description="Our Zero-Knowledge Privacy Policy. We do not store your messages, IP addresses, or personal data. Complete anonymity guaranteed."
            />

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-3xl md:text-4xl font-black gradient-text">Privacy Protocol</h1>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-12">

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Shield className="w-8 h-8" />
                            <h2 className="text-2xl font-bold m-0">Zero-Knowledge Architecture</h2>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Secret Room is built on a fundamental promise: <strong>We cannot see your messages, and neither can anyone else.</strong> Our architecture is designed to be "Zero-Knowledge," meaning the server acts only as a relay and temporary volatile storage that self-destructs.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="bg-card border border-border/50 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Data Ephemerality</h3>
                            <p className="text-muted-foreground">
                                All room data, including messages, participant lists, and metadata, is <strong>hard-deleted</strong> from our database the moment the room timer expires. There are no backups.
                            </p>
                        </div>

                        <div className="bg-card border border-border/50 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                                <EyeOff className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">No Identity Tracking</h3>
                            <p className="text-muted-foreground">
                                We do not require email, phone numbers, or social logins. You are identified only by a session token and a random avatar. We do not log IP addresses associated with chat activities.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">What We Collect (and What We Don't)</h2>
                        <div className="border border-border rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-4 font-bold">Data Point</th>
                                        <th className="p-4 font-bold">Status</th>
                                        <th className="p-4 font-bold">Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="p-4">Chat Messages</td>
                                        <td className="p-4 text-green-500 font-bold">Ephemeral</td>
                                        <td className="p-4 text-muted-foreground">Stored only while room is active, then wiped.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4">IP Address</td>
                                        <td className="p-4 text-green-500 font-bold">Not Logged</td>
                                        <td className="p-4 text-muted-foreground">We do not track user locations.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4">Payment Info</td>
                                        <td className="p-4 text-yellow-500 font-bold">Processor Only</td>
                                        <td className="p-4 text-muted-foreground">Handled safely by Stripe/Dodo. We never see card numbers.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Encryption Standards</h2>
                        <p className="text-muted-foreground">
                            All data in transit is encrypted via TLS 1.3. Data at rest (during the short lifespan of a room) is encrypted using industry-standard AES-256. Row Level Security (RLS) ensures that even if a database breach were theoretically possible, data remains segregated and inaccessible without valid session keys.
                        </p>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground text-center">
                            Last Updated: January 2026. For privacy concerns, contact <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a>.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
