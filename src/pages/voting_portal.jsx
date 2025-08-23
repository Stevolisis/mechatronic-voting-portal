import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vote, Shield, User, Check, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VotingPortal() {
  const [selectedVotes, setSelectedVotes] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [currentSlides, setCurrentSlides] = useState({});
  const [positions, setPositions] = useState([]);
  const navigate = useNavigate();

  const positions2 = [
    {
      id: 'president',
      title: 'President',
      candidates: [
        { id: 'p1', name: 'Ahmed Suleiman', votes: 234, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&crop=face' },
        { id: 'p2', name: 'Fatima Ibrahim', votes: 189, image: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=200&h=250&fit=crop&crop=face' },
        { id: 'p3', name: 'Musa Garba', votes: 156, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=250&fit=crop&crop=face' },
        { id: 'p4', name: 'Aisha Mohammed', votes: 142, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=250&fit=crop&crop=face' },
        { id: 'p5', name: 'Ibrahim Yusuf', votes: 98, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=250&fit=crop&crop=face' }
      ]
    },
    {
      id: 'vicePresident',
      title: 'Vice President',
      candidates: [
        { id: 'vp1', name: 'Khadija Aliyu', votes: 198, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=250&fit=crop&crop=face' },
        { id: 'vp2', name: 'Usman Bello', votes: 176, image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=200&h=250&fit=crop&crop=face' },
        { id: 'vp3', name: 'Amina Hassan', votes: 145, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=250&fit=crop&crop=face' },
        { id: 'vp4', name: 'Abdullahi Sani', votes: 132, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=250&fit=crop&crop=face' },
        { id: 'vp5', name: 'Zainab Umar', votes: 89, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=250&fit=crop&crop=face' }
      ]
    },
    {
      id: 'secretary',
      title: 'Secretary General',
      candidates: [
        { id: 's1', name: 'Hauwa Adamu', votes: 167, image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=250&fit=crop&crop=face' },
        { id: 's2', name: 'Salisu Ahmad', votes: 154, image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=250&fit=crop&crop=face' },
        { id: 's3', name: 'Safiya Musa', votes: 142, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=250&fit=crop&crop=face' },
        { id: 's4', name: 'Bashir Yunusa', votes: 118, image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=250&fit=crop&crop=face' },
        { id: 's5', name: 'Mariam Kabir', votes: 95, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=250&fit=crop&crop=face' }
      ]
    },
    {
      id: 'treasurer',
      title: 'Treasurer',
      candidates: [
        { id: 't1', name: 'Yusuf Abdullahi', votes: 189, image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=250&fit=crop&crop=face' },
        { id: 't2', name: 'Hadiza Lawal', votes: 167, image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=250&fit=crop&crop=face' },
        { id: 't3', name: 'Nuhu Ibrahim', votes: 134, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&crop=face' },
        { id: 't4', name: 'Rukayya Baba', votes: 121, image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=250&fit=crop&crop=face' },
        { id: 't5', name: 'Aliyu Hassan', votes: 87, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=250&fit=crop&crop=face' }
      ]
    },
    {
      id: 'pro',
      title: 'Public Relations Officer',
      candidates: [
        { id: 'pr1', name: 'Bilkisu Audu', votes: 178, image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=250&fit=crop&crop=face' },
        { id: 'pr2', name: 'Garba Suleiman', votes: 156, image: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=200&h=250&fit=crop&crop=face' },
        { id: 'pr3', name: 'Asma Ibrahim', votes: 143, image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=200&h=250&fit=crop&crop=face' },
        { id: 'pr4', name: 'Sanusi Yakubu', votes: 129, image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=200&h=250&fit=crop&crop=face' },
        { id: 'pr5', name: 'Nafisa Aminu', votes: 102, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=250&fit=crop&crop=face' }
      ]
    },
    {
      id: 'welfare',
      title: 'Welfare Director',
      candidates: [
        { id: 'w1', name: 'Jamila Usman', votes: 201, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=250&fit=crop&crop=face' },
        { id: 'w2', name: 'Ahmad Danjuma', votes: 165, image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&h=250&fit=crop&crop=face' },
        { id: 'w3', name: 'Maryam Tijani', votes: 148, image: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=200&h=250&fit=crop&crop=face' },
        { id: 'w4', name: 'Idris Mohammed', votes: 117, image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=200&h=250&fit=crop&crop=face' },
        { id: 'w5', name: 'Zara Aliyu', votes: 94, image: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=200&h=250&fit=crop&crop=face' }
      ]
    }
  ];

  const handleVote = (positionId, candidateId) => {
    setSelectedVotes(prev => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  const handleSlide = (positionId, direction) => {
    setCurrentSlides(prev => {
      const currentIndex = prev[positionId] || 0;
      const maxIndex = positions.find(p => p.id === positionId).candidates.length - 1;
      let newIndex;
      
      if (direction === 'next') {
        newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      }
      
      return { ...prev, [positionId]: newIndex };
    });
  };

  const handleSubmit = () => {
    const votedPositions = Object.keys(selectedVotes).length;
    if (votedPositions === 0) {
      toast.success('Please select at least one candidate to vote for.');
      return;
    }
    setIsDialogOpen(true);
  };

  const handleLogin = () => {
    if (!registrationNumber || !password) {
      toast.info('Please fill in both registration number and password.');
      return;
    }
    console.log('Vote submission:', { 
      votes: selectedVotes, 
      registrationNumber, 
      password 
    });
    setIsDialogOpen(false);
    toast.success('Your votes have been submitted successfully!');
    setSelectedVotes({});
    setRegistrationNumber('');
    setPassword('');
  };

  const totalVotesSelected = Object.keys(selectedVotes).length;

  const fetchPositions = async() => {
    const id = toast.loading('Fetching positions...');
    try{
      const response = await axios.get("https://zvfqblmbmwfscgzhkguk.supabase.co/functions/v1/amses/candidates");
      setPositions(response.data.data);
      toast.success('Positions fetched successfully!', { id });
    }catch(err){
      console.error('Error fetching positions:', err);
      toast.error('Failed to fetch positions. Please try again.', { id });
    }
  }

  useEffect(() => {
    fetchPositions();
  },[]);

  return (
    <div className="w-[100vw] sm:w-[99vw] min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/60 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Navigation */}
    <nav className="relative z-20 w-full bg-white/10 backdrop-blur-xl border-b border-white/20">

        <div className=" mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between">
                <div onClick={()=>navigate("/")} className="cursor-pointer flex items-center space-x-3">
                    <div
                        className="bg-transparent w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <img
                            src="./atbu.png"
                            alt="DMSE"
                            className="aspect-square w-8 rounded-l"
                        />                        
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-white">Abubakar Tafawa Balewa University</h1>
                        <p className="text-xs sm:text-sm text-gray-300">Electronic Voting System</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-gray-300">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Platform</span>
                </div>
            </div>
        </div>
    </nav>

      <div className="relative z-10 w-full px-6 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">CAST YOUR VOTE</h2>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-24"></div>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              2025 ELECTION
            </Badge>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-24"></div>
          </div>
          <p className="text-sm sm:text-base text-gray-300">
            {totalVotesSelected}/6 positions selected
          </p>
        </div>

        {/* Voting Sections */}
        <div className="max-w-6xl mx-auto space-y-8">
          {positions.map((position) => {
            const currentIndex = currentSlides[position.id] || 0;
            const currentCandidate = position.candidates[currentIndex];
            const isSelected = selectedVotes[position.id] === currentCandidate.id;
            
            return (
              <Card key={position.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{position.title}</h3>
                    {selectedVotes[position.id] && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/20">
                        <Check className="w-4 h-4 mr-1" />
                        Voted
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-white bg-[#1348a0] hover:bg-white/10 p-4 h-auto"
                      onClick={() => handleSlide(position.id, 'prev')}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    
                    <div className="flex-1 max-w-sm">
                      <Card
                        className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                          isSelected
                            ? 'border-2 border-blue-400 bg-blue-500/20 transform scale-105'
                            : 'border border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                        }`}
                        onClick={() => handleVote(position.id, currentCandidate.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="relative mb-4">
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=250&fit=crop&crop=face"
                              alt={currentCandidate.name}
                              className="aspect-square w-full sm:w-32 sm:h-40 rounded-lg mx-auto object-cover border-2 border-white/20"
                            />
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-white text-xl mb-2">{currentCandidate.name}</h4>
                          <div className="flex items-center justify-center text-gray-300 mb-4">
                            <User className="w-4 h-4 mr-2" />
                            <span>{currentCandidate.votes} votes</span>
                          </div>
                          <Button
                            className={`w-full ${
                              isSelected 
                                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(position.id, currentCandidate.id);
                            }}
                          >
                            {isSelected ? 'SELECTED' : 'VOTE'}
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <div className="text-center mt-4">
                        <Badge variant="outline" className="text-gray-400 border-gray-400/20">
                          {currentIndex + 1} of {position.candidates.length}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-white bg-[#1348a0] hover:bg-white/10 p-4 h-auto"
                      onClick={() => handleSlide(position.id, 'next')}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-12 pb-8">
          <Button
            className="group px-12 py-6 text-lg font-semibold sm:font-bold text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-2xl border-0"
            style={{ backgroundColor: '#1348a0' }}
            onClick={handleSubmit}
          >
            <Vote className="w-6 h-6 mr-4 group-hover:rotate-12 transition-transform duration-300" />
            SUBMIT VOTES ({totalVotesSelected})
            <div className="w-2 h-2 bg-green-400 rounded-full ml-4 animate-pulse"></div>
          </Button>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Verify Identity</DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter your credentials to submit votes securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="registration" className="text-white">Registration Number</Label>
              <Input
                id="registration"
                placeholder="Enter registration number"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="text-white bg-transparent border-white/20 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogin}
              className="text-white"
              style={{ backgroundColor: '#1348a0' }}
            >
              Submit Votes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}